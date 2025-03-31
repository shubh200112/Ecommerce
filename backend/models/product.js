const mongoose = require('mongoose');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        max: [99999, 'Price cannot exceed 5 digits'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Please enter product description']
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: [true, 'Image must have a public_id']
            },
            url: {
                type: String,
                required: [true, 'Image must have a URL']
            }
        }
    ],
    category: {
        type: String,
        required: [true, 'Please select category for this product'],
        enum: {
            values: [
                'Electronics',
                'Cameras',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Sports',
                'Home',
                'Outdoor',
                'Clothes/shoes',
                'Beauty/Health',
                'Books'
            ],
            message: 'Please select a correct product category'
        }
    },
    seller: {
        type: String,
        required: [true, 'Please enter product seller']
    },
    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        max: [99999, 'Stock cannot exceed 5 digits'],
        default: 0
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [{
        user:{
            type: mongoose.Schema.ObjectId,
            ref : 'user',
            required: true
        },
        name:{
            type: String,
            required : true
        },
        rating: {
            type: Number,
            required: true
        },
        comment: {
                type: String,
                required: true 
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type:mongoose.Schema.ObjectId,
        ref : 'user',
        required: true
    }
});



module.exports = mongoose.model('Product', productSchema);
