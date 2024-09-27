const nodemailer = require('nodemailer')
const emailTemplate = require('../helpers/emailTemplate');
async function emailConfirmation(token, user){
    try{
        const emailTransport = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure:false,
            auth:{
                user: 'testmailing456@gmail.com',
                pass: 'oefb gpie dimt kjri'
            }
        })
        let url = `http://localhost:3000/api/auth/verify-otp/${user._id}/${token}`
        let sender = 'ALLO Media Group';
        let mail = {
            form: sender,
            to: user.email,
            subject: "Checking your email",
            html: emailTemplate(url),
        }
        emailTransport.sendMail(mail, function(error, response){
            if(error){
                console.log(error);
                return response;
            }else{
                console.log('message sent')
                return response;
            }
        })


    }catch(e){
        console.log(e);
    }

}
module.exports = emailConfirmation;