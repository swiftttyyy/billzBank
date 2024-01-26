const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
{
    firstname:{
        type: String,
        default: "seyi"
    },
    lastname:{
        type: String
    },
    fathername:{
        type: String
    },
    mothername:{
        type: String
    },
    email:{
        type: String
    },
    password:{
        type: String
       },
    username:{
        type: String
    },
    accountNo:{
         type: Number
    },
    ssn: {
        type: Number
    },
    phoneNo: {
        type:Number
    }
    //    deposit:{
    //     type: Number,
    //     default:  0
    //    },
    //    lastdeposit:{
    //      type: Number,
    //      default: 0
    //    },
    //    profit:{
    //     type: Number,
    //     default: 0
    //    },
       

    }
)

const User = mongoose.model('User', UserSchema)

module.exports = User