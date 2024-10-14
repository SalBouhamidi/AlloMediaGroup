const nodemailer = require('nodemailer')
const emailTemplate = require('../helpers/emailTemplate');
async function emailConfirmation( email, url, subject){
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
        let name, intro, instructions, buttonText;
        if(url.startsWith('http://localhost:5173/verify/')){
            name =  'Verify Your email please';
            intro = "Welcome to AlloMedia We\'re very excited to have you on board."
            instructions = "To verify your account, please click here:"
            buttonText = 'Confirm your account'

        }else if(url.startsWith('http://localhost:5173/verify-email/')){
            name = "Verify that's You";
            intro = "Welcome to AlloMedia We\'re very excited to have you on board";
            instructions = "Use the code mentionned on the Subject to verify that's you",
            buttonText = "Verify that's You"
        }else if(url.startsWith('http://localhost:5173/resetpassword/')){
            name = "Reset Your password";
            intro = "Welcome to AlloMedia We\'re very excited to have you on board";
            instructions = "Click on the button below to reset Your password",
            buttonText = "Rest your password"
        }
        let sender = 'ALLO Media Group';
        let mail = {
            form: sender,
            to: email,
            subject: subject,
            html: emailTemplate(url,name, intro,instructions,buttonText),
        }
        emailTransport.sendMail(mail, function(error, response){
            if(error){
                console.log(error);
                response = "error"
                return response;
            }else{
                response = "sent"
                return response;
            }
        })
        let result = "sent"
        return result
    }catch(e){
        console.log("something isn't working in email confirmation",e);
    }

}
module.exports = emailConfirmation;