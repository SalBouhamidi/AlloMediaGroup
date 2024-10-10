const crypto = require('crypto');

const otpStore= {};
async function OTPGenerator(){
    let otpCode=  crypto.randomInt(1000, 9999).toString();
    const expiresIn = Date.now() + 300000;
    return {otpCode, expiresIn}
}
module.exports = OTPGenerator;
