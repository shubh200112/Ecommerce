const Product = require('../models/product')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const APIFeatures = require('../utils/apiFeatures')

//Display all products => /api/v1/products?keyword=KD [GET]
exports.getProducts = catchAsyncErrors(
    async (req , res , next) => {
   
    const resPerPage = 4;

    const apiFeatures =  new APIFeatures(Product.find() , req.query).search().filter()  //.pagination(resPerPage)
    
    if (apiFeatures.pagination) {
    apiFeatures.pagination(resPerPage);
}

    const getAllProducts = await apiFeatures.query

    return res.status(200).json({
        success : true,
        count: getAllProducts.length,
        getAllProducts

    })
}
) 

//Get Single Product Details => /api/v1/product/:id [GET]
exports.getSingleProduct = catchAsyncErrors(
    async (req , res ,next) => {
    const product = await Product.findById(req.params.id)

    if(!product){

        return next(new ErrorHandler('Product Not found' , 404))
       
    }

    res.status(200).json({
        success:true,
        product
    })
})
//Create new Product => /api/v1/admin/product/new [POST]
exports.newProduct = catchAsyncErrors(
    async (req, res, next) => {

        req.body.user = req.user.id
    try {
      // Validate required fields before creating product
      // Create product in database
      console.log(req.body)
      const product = await Product.create(req.body);
      console.log("added in db")
      return res.status(201).json({
        success: true,
        product
      })
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      })
    }
  }
) 
  

//update product => /api/v1/admin/product/:id [PUT]
exports.upadateProduct = catchAsyncErrors(
    async(req , res , next) => {

    let product = await Product.findById(req.params.id)

    if(!product) {
        return next(new ErrorHandler('Product Not found' , 404))
    }

    product = await Product.findByIdAndUpdate(req.params.id ,req.body , {
        new: true,
        runValidators:true,
        useFindAndModify: false
    })
    
    res.status(200).json({
        success:true,
        product
    })
}) 

// Deleting Product => /api/v1/admin/product/:id [DELETE]
exports.deleteProduct = catchAsyncErrors(
    async (req , res , next) => {
    
    //finding Products
    let product = await Product.findById(req.params.id)

    if(!product) {
        return next(new ErrorHandler('Product Not found' , 404))
    }

    //Deleting the product
    await product.deleteOne();

    
    res.status(200).json({
        success:true,
        message: "Product Deleted"
    })
})