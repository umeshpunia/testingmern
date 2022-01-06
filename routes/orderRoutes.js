const express = require('express')
const OrderSchema = require('../models/orderModel')
const router = express.Router()



router.get('/', (req, res) => {
    res.send('order route')
})

// get all orders 
router.get('/orders', (req, res) => {
    OrderSchema.find({},(err,data)=>{
        if(err) return res.json({status:500,msg:err.message})
        res.json({status:200,msg:data})
    })
})

// place order
router.post('/place',(req,res)=>{
    const {name,email,price,pid,quantity,address}=req.body
    let placeOrder=new OrderSchema({name,email,price,pid,quantity,address})

    placeOrder.save((err,data)=>{
        if(err) return res.json({status:500,msg:err.message})
        res.json({status:200,msg:"Order Placed Successfully"})
    })
})


// order status update
router.post('/update-status/:_id',(req,res)=>{
    const {status}=req.body
    const {_id}=req.params

    OrderSchema.findByIdAndUpdate(_id,{status},(err,data)=>{
        if(err) return res.json({status:500,msg:err.message})
        res.json({status:200,msg:"Order Status Updated Successfully "+status})
    })
})



module.exports = router