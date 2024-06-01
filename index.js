const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const config = require('./config')
const cookieParser = require('cookie-parser');

// Define routes to call API 
const userRoutes = require('./src/routes/userRoutes') //User routes
const productRoutes = require('./src/routes/productRoutes')// Product routes
const loginRoutes = require('./src/routes/loginRoutes')// Login routes
const newsletterRoutes = require('./src/routes/newsletterRoutes') //Newsletter routes
const cartRoutes = require('./src/routes/cartRoutes')// Cart routes
const orderRoutes = require('./src/routes/orderRoutes')// Order routes
const orderDetailsRoutes = require('./src/routes/order_detailRoutes')//order details routes
const categoryRoutes = require('./src/routes/categoryRoutes')// category routes
const feedbackRoutes = require('./src/routes/feedbackRoutes') // feedback routes
const aiRoutes = require('./src/routes/aiRoutes') //AI route

const app = express()

app.use(express.json({ extended:true })) 
// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000', //frontend's URL
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended : true }))
app.use(cookieParser());

// call the defined API routes 
app.use('/api/', userRoutes.routes)
app.use('/api/', productRoutes.routes) 
app.use('/api/', loginRoutes.routes) 
app.use('/api/', newsletterRoutes.routes) 
app.use('/api/', cartRoutes.routes) 
app.use('/api/', orderRoutes.routes) 
app.use('/api/', orderDetailsRoutes.routes) 
app.use('/api/', categoryRoutes.routes) 
app.use('/api/', feedbackRoutes.routes) 
app.use('/api/', aiRoutes.routes) 

// Wait on localhost
app.listen(config.port, () => {
    console.log(`Server is running at http://localhost:${config.port}`)
})

