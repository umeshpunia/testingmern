const mongoose=require('mongoose')


const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    addedBy:{
        type:String
    },
    addedOn:{
        type:Date,
        default:Date.now
    },
    status:{
        type:Boolean,
        default:true
    }
})

module.exports=mongoose.model('user',UserSchema)