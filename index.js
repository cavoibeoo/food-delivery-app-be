const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const config = require('./config')
const cookieParser = require('cookie-parser');

// Define routes for use
const userRoutes = require('./src/routes/userRoutes')
const productRoutes = require('./src/routes/productRoutes')
const loginRoutes = require('./src/routes/loginRoutes')
const newsletterRoutes = require('./src/routes/newsletterRoutes')
const cartRoutes = require('./src/routes/cartRoutes')
const orderRoutes = require('./src/routes/orderRoutes')
const orderDetailsRoutes = require('./src/routes/order_detailRoutes')
const categoryRoutes = require('./src/routes/categoryRoutes')
const feedbackRoutes = require('./src/routes/feedbackRoutes')
const aiRoutes = require('./src/routes/aiRoutes')

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

// define routes
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


app.listen(config.port, () => {
    console.log(`Server is running at http://localhost:${config.port}`)
})

