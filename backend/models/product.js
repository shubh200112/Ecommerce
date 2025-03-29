const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { 
        type: String, 
        required: [true, 'Review must have a user ID']
    },
    name: { 
        type: String, 
        required: [true, 'Review must have a name']
    },
    rating: { 
        type: Number, 
        required: [true, 'Review must have a rating']
    },
    comment: { 
        type: String, 
        required: [true, 'Review must have a comment']
    }
});

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
    reviews: [reviewSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
