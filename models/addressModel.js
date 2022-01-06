const mongoose=require('mongoose')


const AddressSchema=new mongoose.Schema({
    address:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('address',AddressSchema)