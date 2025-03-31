const Product = require('../models/product')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const APIFeatures = require('../utils/apiFeatures')
const mongoose = require("mongoose")
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

//create a new reveiw => /api/v1/review [post]/[put]

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    console.log("Received Data:", req.body);

    const product = await Product.findById(productId);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    console.log("Product Found:", product);

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment: comment || "No comment provided"  // Ensure comment exists
    };

    const isReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach((r) => {
            if (r.user.toString() === req.user._id.toString()) {
                r.comment = comment;  // Ensure comment updates
                r.rating = rating;
            }
        });
    } else {
        product.reviews.push(review);
    }

    product.numberOfReviews = product.reviews.length;

    product.ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        (product.reviews.length || 1);

    await product.save({ validateBeforeSave: false });

    console.log("Updated Product Reviews:", product.reviews);

    res.status(200).json({
        success: true,
        message: "Review added successfully",
        reviews: product.reviews.map(r => ({
            user: r.user,
            name: r.name,
            rating: r.rating,
            comment: r.comment  // Ensure comment is included
        }))
    });
    
});

// Get PRODUCT Reviews => /api/v1/reviews
exports.getProductReviews = catchAsyncErrors(
    async (req , res , next) => {
        const product = await Product.findById(req.query.id)
    
        res.status(200).json({
            success:true,
            reviews: product.reviews,
            message: "displaying all the reviews of the product"
        })
    }
)

// delete reviews of a product => /api/v1/reviews [delete] [pid, id(userId)]
exports.deleteReview = catchAsyncErrors(
    async (req, res, next) => {
        const product = await Product.findById(req.query.productId)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const reviews = product.reviews.filter(review => review.user.toString() !== req.query.id.toString())

        const numberOfReviews = reviews.length

        const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

        console.log("Received productId:", req.query.productId);
        console.log("Received reviewId:", req.query.id);
        console.log("Fetched product:", product);

        await Product.findByIdAndUpdate(req.query.productId ,{
            reviews,
            ratings,
            numberOfReviews
        },{
            new:true,
            runValidators :true ,
            useFindAndModify : false
        })

    res.status(200).json({
        success: true,
        message: "Review deleted successfully",
        updatedReviews: reviews
    });
});

