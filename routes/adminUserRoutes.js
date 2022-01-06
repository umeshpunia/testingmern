const express = require('express')
const UserSchema = require('../models/userModel')
const bcrypt = require('bcrypt');

const router = express.Router()


router.get('/', (req, res) => {
    res.send('user route is working')
})

router.get('/users', (req, res) => {
    UserSchema.find({}, (err, users) => {
        if(err) return res.status(500).send(err)
        res.status(200).json({ message: users })
    })
})



// register route
router.post('/add-user', (req, res) => {
    const { email, password,addedBy,name } = req.body
    if (!email || !password || !addedBy || !name) {
        res.status(400).send('please fill form correctly')
    } else {
        // hash password
        bcrypt.hash(password, 10, function (err, hash) {
            // Store hash in your password DB.
            if (err) return res.status(500).json({ message: 'error in saving user' })
            let user = new UserSchema({ email, password:hash,addedBy,name })
            user.save((err, user) => {
                if (err) return res.status(500).json({ message: 'error in saving user' })
                res.status(200).json({ message: 'user saved successfully' })
            })
        });
    }
})


// login route
router.post('/login',(req,res)=>{
    const {email,password} = req.body
    if (!email || !password) {
        res.status(400).json({message:'please enter email and password'})
    }else{
        UserSchema.findOne({email},(err,user)=>{
            // res.status(200).json({message:user})
            if(err) return res.status(500).json({message:'error in finding user'})
            bcrypt.compare(password, user.password).then(function(result) {
                if(!result) return res.status(401).json({message:'invalid email or password'})
                res.status(200).json({message:{email:user.email}})
            });
            
        })
    }
})

// update status of user

router.put('/status/:_id',(req,res)=>{
    const {_id} = req.params
    const {status} = req.body
    if (!_id ) {
        res.status(400).json({message:'please enter id and status'})
    }else{
        console.log('hiting')
        UserSchema.findOneAndUpdate({_id},{status:!status},(err,user)=>{
            if(err) return res.status(500).json({message:'error in finding user'})
            res.status(200).json({message:'user status updated successfully'})
        })
    }
})


module.exports = router