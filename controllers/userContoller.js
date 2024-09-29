const { response } = require('../app');
const User = require('../Models/user');
const hashPassword = require('../helpers/hashPassword');
const tokenGenerator = require('../helpers/tokenGenerator');
const emailConfirmation = require('../helpers/emailConfirmation');
const jwt = require('jsonwebtoken');
const Joi = require('joi')


class UserController{
   static async  Register(req, res){

    const {name, email, password, countrycode,phonenumber} = req.body;
    const UserScheme = Joi.object({
        name: Joi.string().min(3).required().messages(),
        email: Joi.string().alphanum().email().required().messages(),
        password: Joi.string().required().messages(),
        countrycode: Joi.string().alphanum().required().messages(),
        phonenumber: Joi.number().required().messages(),
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
            await emailConfirmation(token, user)
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

    if(!token || !userId){
        return res.status(400).json({message: "Your token is expired"});
    }else{
            
            let verification = jwt.verify(token,`${process.env.TOKEN_SECRET}${userId}`);
            if(verification){
                res.status(200).json({message: 'the token is working yeyeye'});
            }else{
                res.status(500).json({message: 'This token has been expired or damaged'});
            }
    }

   }

}

module.exports = UserController;