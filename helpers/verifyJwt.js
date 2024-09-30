const jwt = require('jsonwebtoken');
async function VerifyJwt(token, userId){
    if(!token || !userId){
        return res.status(400).json({message: "Your token is expired"});
    }
    const verification = jwt.verify(token, `${process.env.TOKEN_SECRET}${userId}`);
    return verification;
}
module.exports = VerifyJwt;