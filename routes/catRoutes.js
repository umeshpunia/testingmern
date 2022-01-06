const express = require('express')
const CatSchema = require('../models/categoryModel')
const multer = require('multer')
const router = express.Router()
const fs = require('fs')



// upload files
let path = "./assets/images/category";
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
    res.send('category route is working')
})



// add cat route
router.post('/add-cat', (req, res) => {

    upload(req, res, (err) => {
        if (err) {
            res.send({ err: 500, msg: err.message });
        } else {
            const { name, description, addedBy } = req.body;
            let pic = req.file.filename;


            let insCat = new CatSchema({
                name,
                description,
                addedBy,
                pic,
            });

            insCat.save((err) => {
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

// get cats
router.get('/categories',(req,res)=>{
    CatSchema.find({},(err,cats)=>{
        if(err){
            res.json({status:500,msg:err.message})
        }else{
            
            res.json({status:200,msg:cats})
        }
    })
})
// single category
router.get('/:_id',(req,res)=>{
    const {_id} = req.params;
    CatSchema.findOne({_id},(err,cat)=>{
        if(err){
            res.json({status:500,msg:err.message})
        }else{
            
            res.json({status:200,msg:cat})
        }
    })
})


// delete cat
router.delete('/del/:_id',(req,res)=>{
    const {_id} = req.params;
    
    CatSchema.findByIdAndDelete(_id,(err,cat)=>{
        if(err){
            res.json({status:500,msg:err.message})
        }else{
            fs.unlink('./assets/images/category/'+cat.pic,(err)=>{
                res.json({status:200,msg:'Success'})
            })
        }
    })
})


module.exports = router