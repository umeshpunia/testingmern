const express = require("express");
const AddressSchema = require("../models/addressModel");
const FrontUserSchema = require("../models/frontUserModel");
const OrderSchema = require("../models/orderModel");
const bcrypt = require("bcrypt");
const router = express.Router();
const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });
const https=require('https')
const config=require('./paytm/config')
const qs=require('querystring')
const checksum_lib=require('./paytm/checksum')
const M_ID = "ejGRQs36885119876626";
const M_KEY = "6JoQ0bSNMV#&A#SE";

// user registration
router.post("/registration", (req, res) => {
  const { email, name, password } = req.body;

  bcrypt.hash(password, 12, (err, hashPass) => {
    if (err) return res.json({ status: 500, msg: err.message });
    let insUser = new FrontUserSchema({ email, password: hashPass, name });
    insUser
      .save()
      .then((user) => {
        if (!user) return res.json({ status: 500, msg: "something wrong" });
        res.json({ status: 200, msg: "Registration Success" });
      })
      .catch((err) => {
        res.json({ status: 500, msg: err.message });
      });
  });
});

// login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "please enter email and password" });
  } else {
    console.log("working", email, password);
    FrontUserSchema.findOne({ email }, (err, user) => {
      if (err)
        return res.status(500).json({ message: "error in finding user" });
      if (!user)
        return res.status(400).json({ message: "error in finding user" });
      bcrypt.compare(password, user.password).then(function (result) {
        if (!result)
          return res.status(401).json({ message: "invalid email or password" });
        res.status(200).json({ status: 200, msg: user.email });
      });
    });
  }
});

// add address
router.post(`/add-address/:email`, (req, res) => {
  const { email } = req.params;
  const { address } = req.body;

  let insAddress = new AddressSchema({ email, address });

  insAddress
    .save()
    .then((result) => {
      if (!result) return res.json({ status: 500, msg: "something wrong" });
      res.json({ status: 200, msg: "Address Success" });
    })
    .catch((err) => {
      res.json({ status: 500, msg: err.message });
    });
});

// get address
router.get(`/address/:email`, (req, res) => {
  const { email } = req.params;
  AddressSchema.find({ email }, (err, result) => {
    if (err) return res.json({ status: 500, msg: err.message });
    res.json({ status: 200, msg: result });
  });
});

// place order
router.post("/place-order", (req, res) => {
  const { name, email, address, product } = req.body;
  console.log(req.body);
  let insOrder = new OrderSchema({ name, email, address, product });

  insOrder
    .save()
    .then((result) => {
      if (!result) return res.json({ status: 500, msg: "something wrong" });
      res.json({ status: 200, msg: "Order Place Successfully" });
    })
    .catch((err) => {
      res.json({ status: 500, msg: err.message });
    });
});

// paytm pay
router.post("/paynow", [parseUrl, parseJson],(req, res) => {
    // Route for making payment
  
    var paymentDetails = {
      amount: 100,
      customerId: "umesh",
      customerEmail: "umeshsinghpunia@gmail.com",
      customerPhone: 7015244229
  }
  if(!paymentDetails.amount || !paymentDetails.customerId || !paymentDetails.customerEmail || !paymentDetails.customerPhone) {
      res.status(400).send('Payment failed')
  } else {
      var params = {};
      params['MID'] = config.PaytmConfig.mid;
      params['WEBSITE'] = config.PaytmConfig.website;
      params['CHANNEL_ID'] = 'WEB';
      params['INDUSTRY_TYPE_ID'] = 'Retail';
      params['ORDER_ID'] = 'TEST_'  + new Date().getTime();
      params['CUST_ID'] = paymentDetails.customerId;
      params['TXN_AMOUNT'] = paymentDetails.amount;
      params['CALLBACK_URL'] = 'http://localhost:8080/api/front/callback';
      params['EMAIL'] = paymentDetails.customerEmail;
      params['MOBILE_NO'] = paymentDetails.customerPhone;
  
  
      checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
          var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
          // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production
  
          var form_fields = "";
          for (var x in params) {
              form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
          }
          form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";
  
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
          res.end();
      });
  }
  });

// paytm callback
router.post("/callback", (req, res) => {
    // Route for verifiying payment
  
    var body = '';
  
    req.on('data', function (data) {
       body += data;
    });
  
     req.on('end', function () {
       var html = "";
       var post_data = qs.parse(body);
  
       // received params in callback
       console.log('Callback Response: ', post_data, "\n");
  
  
       // verify the checksum
       var checksumhash = post_data.CHECKSUMHASH;
       // delete post_data.CHECKSUMHASH;
       var result = checksum_lib.verifychecksum(post_data, config.PaytmConfig.key, checksumhash);
       console.log("Checksum Result => ", result, "\n");
  
  
       // Send Server-to-Server request to verify Order Status
       var params = {"MID": config.PaytmConfig.mid, "ORDERID": post_data.ORDERID};
  
       checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
  
         params.CHECKSUMHASH = checksum;
         post_data = 'JsonData='+JSON.stringify(params);
  
         var options = {
           hostname: 'securegw-stage.paytm.in', // for staging
           // hostname: 'securegw.paytm.in', // for production
           port: 443,
           path: '/merchant-status/getTxnStatus',
           method: 'POST',
           headers: {
             'Content-Type': 'application/x-www-form-urlencoded',
             'Content-Length': post_data.length
           }
         };
  
  
         // Set up the request
         var response = "";
         var post_req = https.request(options, function(post_res) {
           post_res.on('data', function (chunk) {
             response += chunk;
           });
  
           post_res.on('end', function(){
             console.log('S2S Response: ', response, "\n");
  
             var _result = JSON.parse(response);
               if(_result.STATUS == 'TXN_SUCCESS') {
                   res.send('payment sucess')
               }else {
                   res.send('payment failed')
               }
             });
         });
  
         // post the data
         post_req.write(post_data);
         post_req.end();
        });
       });
  });

module.exports = router;
