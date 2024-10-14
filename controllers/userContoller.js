const { response } = require('../app');
const User = require('../Models/user');
const hashPassword = require('../helpers/hashPassword');
const tokenGenerator = require('../helpers/tokenGenerator');
const emailConfirmation = require('../helpers/emailConfirmation');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const checkHashedPassword = require('../helpers/checkHashedPassword');
// const OTPGenerator = require('../helpers/OTPGenerator');
const sendOtp = require('../helpers/sendOtp');
const VerifyJwt = require('../helpers/verifyJwt');
const { hash } = require('bcryptjs');
const Role = require('../Models/role')


class userController{
   static async  Register(req, res){
    const {name, email, password, countrycode,phonenumber} = req.body;
    const UserScheme = Joi.object({
        name: Joi.string().min(3).required().messages(),
        email: Joi.string().email().required().messages(),
        password: Joi.string().required().messages(),
        phone: Joi.array().items(Joi.object({
            countrycode: Joi.string().required().messages(),
            phonenumber: Joi.string().required().messages(),
        })).required().messages(),
    })

    const result = await UserScheme.validate(req.body);
    if(result.error){
        console.log(result.error)
        return res.status(400).json({message: result.error.details[0].message})
    }

    try{
        const hashedPassword = await hashPassword(password);
        let userRole = await Role.findOne({role:'user'});
        console.log(userRole);
        const user = await new User({
            name: name,
            email: email,
            password: hashedPassword,
            phone:[{
                countrycode:countrycode,
                phonenumber: phonenumber
            }],
            isvalid: false,
            role: [userRole]
        })

        await user.save();
        console.log(user);
        if(user){
            const token = await tokenGenerator(user, 10);
            console.log(token);
            let url = `http://localhost:5173/verify/${user._id}/${token}`
            let subject = "checking If Your email is valid"
            await emailConfirmation( user.email, url, subject)
            res.status(201).json({ message: 'User registered successfully' });
        }else{
            res.status(500).json({ error: 'Internal server error' });
        }
    }catch(e){
        if(e.code == 11000){
            return res.status(400).json({ message: 'Email already exists' });
        }
        console.error(e)
        return res.status(200).json('smth bad happend ')

    }

   }

   static async VerifyToken(req,res){
    let token = req.params.token;
    let userId = req.params.user_id;
    try {
        let verification = await VerifyJwt(token, userId)
        if(verification){
            await User.updateOne({ _id: userId }, { isvalid: true });
            res.status(200).json({ message: 'The token is valid yeyeye' });
        }
    } catch (error) {
        res.status(400).json({ message: 'This token has expired or is invalid' });
    }

   }

   static async Login(req, res){
    try{
        const {email, password} = req.body;
        const userFound = await User.findOne({email:email});
        if(!userFound){
            return res.status(401).json({message: 'invalid email or password'})
        }

        let passwordCheck = await checkHashedPassword(password, userFound.password);
        if(!passwordCheck){
            return res.status(401).json({message: 'invalid email or password'})
        }

        if(userFound.isvalid == false){
            const token = await tokenGenerator(userFound, 10);
            let url = `http://localhost:5173/verify/${userFound._id}/${token}`
            let subject = "checking If Your email is valid"
            await emailConfirmation( userFound.email, url, subject)
            return res.status(201).json({ message: 'Email is verified try to login again' });
        }

        let response = await sendOtp(res,userFound._id, userFound.email);
        console.log(response);
        return res.status(201).json({message: 'User logged successfully, kindly check ur OTP code in your email', userFound})
    }catch(e){
        console.error(e);
        return res.status(500).json({message: 'The login is failed smth bad happened'})
    }
   }

   static async resendCode (req,res){
        let userId = req.params.id
        let UserFound = await User.findOne({_id:userId});
        if(UserFound){
            let response = await sendOtp(res, UserFound._id, UserFound.email);
            if(response.success){
                return res.status(201).json({message: response.message});
            }else{
                return res.status(401).json({message: response.message});
            }

        }else{
            return res.status(401).json({message: "Please try to login or Try later"});
        }
   }





   static async verifyOTP(req, res) {
    let userId = req.params.id;
    let user = await User.findOne({_id:userId});
    try{
        if(user){
            // console.log('otp from uel',req.params.otpCode);
            let code = atob(req.params.otpCode);
            let otp = code.split("/");
            if(!otp[0]){
                return res.json({message: 'Your code wasn\'t generated or expired'});
            }
            if(Date.now() > otp[1]){
                return res.status(401).json({message:'Your code was expired, please login again to ur account'})
            }
            if(otp[0] !== req.body.otpcode){
                return res.status(401).json({message:'Your code is not correct'});
            }else{
                return res.status(200).json({message:'Your code is correct'});
            }
        }else if(!user){
            return res.status(401).json({message:'Your not found,Please try to login in again'})
        }

    }catch(e){
        console.log(e);
        return res.status(500).json({message: 'The code is not set, smth bad happend'})
    }


}

    static async forgetpassword(req, res){
        try{
            const useremail = req.body.email;
            const userFound = await User.findOne({email:useremail});
            if(userFound){
                let token = await tokenGenerator(userFound, 72);
                if(token){
                    let url =`http://localhost:5173/resetpassword/${userFound._id}/${token}`;
                    let subject = 'Reset Your password';
                    let sendEmail = await emailConfirmation(userFound.email, url, subject);
                    return res.status(200).json({message: 'email to reset your password is sent successfully'})
                }
            }else{
                return res.status(401).json({message: 'Your Email is not valid'})
            }
        }catch(e){
            console.error(e);
            return res.status(500).json({message: 'The email of forget password is not send successfully'});
        }
       
    }

    static async resetpassword(req, res){
        let userid = req.params.id;
        let token = req.params.token;
        try{
            let verification = await VerifyJwt(token,userid);
            if(verification){
                const {password, confirmPassword} = req.body;
                const UserScheme = Joi.object({
                    password: Joi.string().min(4).max(30).required().messages({
                        "string.pattern.base": `Password must be between 3 to 30 characters of characters and numbers`,
                        "any.required": `Password is required`,
                      }),
                    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
                        "any.only": "The two passwords do not match",
                        "any.required": "Please re-enter the password",
                      }),
                });
                
                const result = await UserScheme.validate(req.body);
                if(result.error){
                    console.log(result.error)
                    return res.json({message: result.error.details[0].message})
                }else{
                    let newPassword = await hashPassword(req.body.password);
                    const user = await User.updateOne({_id:userid}, {password:newPassword});
                    if(user){
                        return res.status(200).json({message: 'password reseted successfully'});
                    }else{
                        return res.status(400).json({message: 'password isn\'t reseted '});
                    }
                }
                
            }else{         
                return res.status(400).json({message:"The token is not valid try to verify through the link we sent to ur email"});
            }
        }catch(e){
            console.log(e);
            if (e.name === 'TokenExpiredError') {
                return res.status(400).json({message:"The token is not expired"});
            }
            return res.status(400).json({message:"The token is not valid"});

        }
 
    }

    

    static async Logout(req, res){
        req.session.destroy();
        return res.json({message: 'the User is Loged out'});
    }





}

module.exports = userController;