const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')

const errorHandler = require('./utils/errorHandler')
const errorMiddleware = require('./middlewares/errors');

//parseing URL encoded body
app.use(express.urlencoded({extended : false}))

app.use(express.json())
app.use(cookieParser())

app.use(express.urlencoded({ extended: true }));
//Import all Product routes
const products = require('./routes/product')
const auth = require('./routes/auth')
const order = require('./routes/order')


app.use('/api/v1', products)
app.use('/api/v1', auth)
app.use('/api/v1', order)


//Middleware ro handle
app.use(errorMiddleware);
module.exports = app