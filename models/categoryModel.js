const mongoose=require('mongoose')


const CatSchema=new mongoose.Schema({
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
    }
})

module.exports=mongoose.model('category',CatSchema)