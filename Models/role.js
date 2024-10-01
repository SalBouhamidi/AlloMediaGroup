const { default: mongoose } = require('mongoose')
const Schema = mongoose.Schema;

const roleSchema = Schema({
    role:({
        type: String
    }),
})

module.exports = Role = mongoose.model("Roles",roleSchema) 