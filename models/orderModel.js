const mongoose=require('mongoose')


const OrderSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:{
        type:String
    },
    status:{
        type:String,
        default:"pending"
    },
    product:[{
        pid:{type:String,required:true},
        price:{type:Number,required:true},
        quantity:{type:Number,required:true}
    }]
})

module.exports=mongoose.model('order',OrderSchema)