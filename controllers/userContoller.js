const { response } = require('../app');
const User = require('../Models/user');
const hashPassword = require('../helpers/hashPassword');
const tokenGenerator = require('../helpers/tokenGenerator');
const emailConfirmation = require('../helpers/emailConfirmation');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const checkHashedPassword = require('../helpers/checkHashedPassword');
const OTPGenerator = require('../helpers/OTPGenerator');
const VerifyJwt = require('../helpers/verifyJwt');
const { hash } = require('bcryptjs');


class UserController{
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
        return res.json({message: result.error})
    }

    try{
        const hashedPassword = await hashPassword(password);
        const user = await new User({
            name: name,
            email: email,
            password: hashedPassword,
            phone:[{
                countrycode:countrycode,
                phonenumber: phonenumber
            }],
            isvalid: false,
        })
        await user.save();
        if(user){
            const token = await tokenGenerator(user, 10);
            console.log(token);
            let url = `http://localhost:3000/api/auth/verify-user/${user._id}/${token}`
            let subject = "checking If Your email is valid"
            await emailConfirmation( user, url, subject)
            res.status(201).json({ message: 'User registered successfully' });
        }else{
            res.status(500).json({ error: 'Internal server error' });

        }
    }catch(e){
        // console.error('error is',e._message, 'beacause',e.path, 'need to be or is', e.kind);
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
        let otpgenerator =  await OTPGenerator(userFound);
        console.log(otpgenerator);
        if(otpgenerator){
            let code = btoa(`${otpgenerator.otpCode}/${otpgenerator.expiresIn}`);
            let url = `http://localhost:3000/api/auth/verify-otp/${userFound._id}/${code}`, 
            subject = `Your Verifictaion code is ${otpgenerator.otpCode}`
            let ConfirmOtp = await emailConfirmation( userFound, url, subject);
            res.status(200).json({message: 'user successfully loged'})

        }

    }catch(e){
        console.error(e);
        return res.status(500).json({message: 'The login is failed smth bad happened'})
    }
   }

   static async verifyOTP(req, res) {
    let userId = req.params.id;
    let user = await User.findOne({_id:userId});
    try{
        if(user){
            let code = atob(req.params.otpCode);
            let otp = code.split("/");
            if(!otp[0]){
                return res.json({message: 'Your code wasn\'t generated or expired'});
            }
            if(Date.now() > otp[1]){
                return res.status(401).json({message:'Your code was expired, please login again to ur account'})
            }
            if(otp[0] !== req.body.code){
                return res.status(401).json({message:'Your code is not correct'});
            }else{
                return res.status(200).json({message:'Your code is correct'});
            }
        }else if(!user){
            return res.status(401).json({message:'Please try to login in again'})
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
                let token = await tokenGenerator(userFound, 1);
                console.log(token);
                if(token){
                    let url =`http://localhost:3000/api/auth/resetpassword/${userFound._id}/${token}`;
                    let subject = 'Reset Your password';
                    await emailConfirmation(userFound, url, subject);
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
        let verification = await VerifyJwt(token,userid);
        // console.log('verification is',verification);
        if(verification){
            // res.status(200).json({message:"Your verification is done, reset ur password"});
            const {password, confirmPassword} = req.body;
            const UserScheme = Joi.object({
                password: Joi.string().min(4).max(30).required().messages({
                    "string.pattern.base": `Password must be between 3 to 30 characters of characters and numbers`,
                    "string.empty": `Password cannot be empty`,
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
                return res.json({message: result.error})
            }else{
                let newPassword = await hashPassword(req.body.password);
                const user = await User.updateOne({_id:userid}, {password:newPassword});
                if(user){
                    return res.status(200).json({message: 'password reseted successfully'});
                }
            }


        }else{
            return res.status(400).json({message:"The token is not valid try to verify through the link we sent to ur email"});

        }
    }



}

module.exports = UserController;