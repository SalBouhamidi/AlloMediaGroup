const emailConfirmation = require('./emailConfirmation');
const OTPGenerator = require('./OTPGenerator');



async function sendOtp(res, id, email){

    let otpgenerator =  await OTPGenerator();
    if(otpgenerator){
        let code = btoa(`${otpgenerator.otpCode}/${otpgenerator.expiresIn}`);
        let url = `http://localhost:5173/verify-email/${id}/${code}`, 
        subject = `Your Verifictaion code is ${otpgenerator.otpCode}`
        let ConfirmOtp = await emailConfirmation(email, url, subject);
        if(ConfirmOtp){
            return { success: true, message: 'Kindly check ur email and verify your account' };
        }else{
            return { success: false, message: 'Ops something bad happend try to login again' };

        }
    }else if (!otpgenerator){
        return { success: false, message: 'OTP generation failed please log in again.' };
    }
   }
module.exports = sendOtp;