const Product  = require('../models/product')
const dotenv = require('dotenv')
const connectDatabase = require('../config/database')

//Importing to Dummy data
const productsData = require('../data/product.json')

//Setting ENV FILE
dotenv.config({
    path: 'backend/config/config.env'
})

//Connecting to DataBase
connectDatabase()

const insertProducts = async () => {
    try {
        //Delete<amy will delete the entire database
        await Product.deleteMany()
        console.log('Products are Deleted');

        //InsertMany will add multiple data into the database
        await Product.insertMany(productsData)
        console.log('All products data inserted');

        process.exit()
    } catch (error) {
        console.log(error.message);
        process.exit(1)
    }
}

//Calling datainsertion Function
insertProducts()