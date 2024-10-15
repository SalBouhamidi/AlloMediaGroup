const { default: mongoose } = require('mongoose')
const Role = require('./role');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        minLength: [3, 'Last Name too short'],
        maxLength: [50, 'Last Name too long']
    },
    email:{
        type:String,
        required: true,
        unique:true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone:[
        {
            countrycode:String,
            phonenumber: String,
        },

    ],
    isvalid:{
        type:Boolean,
        required:true,
    },
    createdAt:{
        type:Date,
        default: Date.now(),
    },
    role: [{ type: Schema.Types.ObjectId, ref: 'Role' }]

})

module.exports = mongoose.model("User",userSchema);