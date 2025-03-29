const express = require('express')
const app = express()

const errorHandler = require('./utils/errorHandler')
const errorMiddleware = require('./middlewares/errors');

//parseing URL encoded body
app.use(express.urlencoded({extended : false}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
//Import all Product routes
const products = require('./routes/product')
const auth = require('./routes/auth')


app.use('/api/v1', products)
app.use('/api/v1', auth)

//Middleware ro handle
app.use(errorMiddleware);
module.exports = app