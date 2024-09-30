const crypto = require('crypto');

const otpStore= {};
async function OTPGenerator(user){
    let otpCode=  crypto.randomInt(100000, 999999).toString();
    const expiresIn = Date.now() + 300000;
    return {otpCode, expiresIn}
}
module.exports = OTPGenerator;
