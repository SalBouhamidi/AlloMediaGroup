const jwt = require('jsonwebtoken');
async function tokenGenerator(user, expiration){
    const payload = {
        id: user._id,
        username: user.name,
    };
    const secret= process.env.TOKEN_SECRET;
    const userId = user.id;
    const secretKey = `${secret}${userId}`;
    const token = await jwt.sign(payload, secretKey, {expiresIn: `${expiration}h`});
    return token;
}

module.exports = tokenGenerator;