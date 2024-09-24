const { default: mongoose } = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = Schema({
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        index: {
            unique:true,
        }
    },
    createdAt:{
        type:Date,
        default: Date.now(),
    },
})

module.exports = User = mongoose.model("Users",userSchema)