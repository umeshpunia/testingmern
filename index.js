const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors=require('cors')
const adminUserRoutes=require('./routes/adminUserRoutes')
const catRoutes=require('./routes/catRoutes')
const proRoutes=require('./routes/productRoutes')
const orderRoutes=require('./routes/orderRoutes')

const port = process.env.PORT || 90;
const app = express();




// middleware

app.use(cors())
app.use('/images', express.static('assets/images'));
app.use(express.json());
app.use('/api/admin/user/',adminUserRoutes)
app.use('/api/admin/category/',catRoutes)
app.use('/api/admin/product/',proRoutes)
app.use('/api/admin/order/',orderRoutes)
app.use('/api/front/',require('./routes/frontRoutes'))




// db connection
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@umesh.hybg3.mongodb.net/mern3pmproject?retryWrites=true&w=majority`, { useNewUrlParser: true }, (err) => {
    if(err) return console.log(err);
    console.log('connected')
    app.listen(port, () => console.log(`listening on http://localhost:${port}`));
})




// routes
app.use('/',express.static('public'))

