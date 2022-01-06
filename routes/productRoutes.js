const express = require('express')
const ProSchema = require('../models/productSchema')
const multer = require('multer')
const router = express.Router()
const fs = require('fs')


// upload files
let path = "./assets/images/products";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path);
    },
    filename: function (req, file, cb) {
        const { originalname } = file;

        // 1.png
        const fileArr = originalname.split(".");

        const ext = fileArr[fileArr.length - 1];

      
        function randomString(length) {
            var result = "";
            var characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(
                    Math.floor(Math.random() * charactersLength)
                );
            }
            return result;
        }

        cb(null, `${randomString(25)}.${ext}`);
    },
});

const upload = multer({ storage }).single("pic");



router.get('/', (req, res) => {
    res.send('product route is working')
})



// add pro route
router.post('/add-pro', (req, res) => {
    console.log(req.body)
    upload(req, res, (err) => {
        if (err) {
            res.send({ err: 500, msg: err.message });
        } else {
            const { name,description,addedBy,price,category } = req.body;
            let pic = req.file.filename;


            let insPro = new ProSchema({name,description,addedBy,price,pic,category});

            insPro.save((err) => {
                if (err) {
                    res.json({ status: 500, msg: err.message });
                } else {
                    res.json({ status: 200, msg: "Done" });
                }
            });

            // end
        }
    });
})

// get products
router.get('/products',(req,res)=>{
    ProSchema.find({},(err,pros)=>{
        if(err){
            res.json({status:500,msg:err.message})
        }else{
            
            res.json({status:200,msg:pros})
        }
    })
})


// delete product
router.delete('/del/:_id',(req,res)=>{
    const {_id} = req.params;
    
    ProSchema.findByIdAndDelete(_id,(err,cat)=>{
        if(err){
            res.json({status:500,msg:err.message})
        }else{
            fs.unlink('./assets/images/products/'+cat.pic,(err)=>{
                res.json({status:200,msg:'Success'})
            })
        }
    })
})

// fetch using cat
router.get('/:_id',(req,res)=>{
    const {_id} = req.params;
    ProSchema.find({category:_id},(err,pros)=>{
        if(err){
            res.json({status:500,msg:err.message})
        }else{
            
            res.json({status:200,msg:pros})
        }
    })
})

// fetch single product
router.get('/product/:_id',(req,res)=>{
    const {_id} = req.params;
    ProSchema.findOne({_id},(err,pros)=>{
        if(err){
            res.json({status:500,msg:err.message})
        }else{
            res.json({status:200,msg:pros})
        }
    })
})


module.exports = router