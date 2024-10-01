 const bcrypt = require('bcryptjs')

const hashPassword = async (password) => {
    try{
        const salt = await bcrypt.genSalt(10);
        const passwordhashed = await bcrypt.hash(password, salt);
        return passwordhashed;
    }catch(e){
        console.log('smth is not working in the hashage',e)
    }

}


module.exports = hashPassword;