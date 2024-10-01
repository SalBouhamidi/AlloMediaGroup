const bcrypt = require('bcryptjs');

async function comparePassword(password, hashedPass){
    return  await bcrypt.compare(password, hashedPass);
}
module.exports = comparePassword