const mongoose=require('mongoose')


const ProSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    pic:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    addedOn:{
        type:Date,
        default:Date.now
    },
    addedBy:{
        type:String
    },
    active:{
        type:Boolean,
        default:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    }
})


module.exports=mongoose.model('product',ProSchema)