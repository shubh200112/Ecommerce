const Order = require('../models/order')
const Product = require('../models/product')
const User = require('../models/user')

const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const { render } = require('../app')

//Create a new ordeer => /api/v1/order/new [post]
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    // Check if the user is authenticated (req.user should exist)
    if (!req.user || !req.user.id) {
        return next(new ErrorHandler("User not authenticated", 401));
    }

    // Validate required fields
    if (!orderItems || !shippingInfo || !totalPrice) {
        return next(new ErrorHandler("Missing required fields", 400));
    }

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        user: req.user.id,  // ✅ Ensuring user is passed
        paidAt: Date.now()
    });

    res.status(201).json({
        success: true,
        order
    });
});

// Get single order => /api/v1/order/:id [get]
exports.getSingleOrder = catchAsyncErrors(
    async (req , res ,next) => {
        const order = await Order.findById(req.params.id).populate('user', 'name email')

        if(!order) {
            return next(new ErrorHandler('No Order found with this Id' , 404))
        }

        res.status(200).json({
            success: true,
            order
        });

    }
)
// Get all orders => /api/orders/me [get]
exports.myOrder = catchAsyncErrors(
    async (req , res ,next) => {
        const orders = await Order.find({
            user: req.user.id
        })

        res.status(200).json({
            success: true,
            orders
        });

    }
)
// ADMIN

//Get all orders - ADMIN => /api/v1/admin/orders [get]
exports.allOrders = catchAsyncErrors(
    async (req , res ,next) => {
        const orders = await Order.find()

        let totalAmount = 0

        orders.forEach(order => {
            totalAmount = totalAmount + order.totalPrice
        });

        res.status(200).json({
            success: true,
            totalAmount,
            orders
        });

    }
)

// update / Process order - ADMIN => /api/v1/admin/order/:idm [Put]
exports.updateOrder = catchAsyncErrors(
    async (req , res ,next) => {
        const order = await Order.findById(req.params.id)
    
    if(order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('Your order has been already delivered',400))
    }

    order.orderItems.forEach(async item => {
       await updateStock(item.product , item.quantity)
    })

    order.orderStatus = req.body.status

    order.deliveredAt = Date.now()

    await order.save()

    res.status(200).json({
        success: true
        
    });
}
)

//Update stock
async function updateStock(id , quantity) {
    const product = await Product.findById(id)

    product.stock = product.stock - quantity

    await product.save({
        validateModifiedOnly : false

    })
}

//delete order => /api/v1/admin/order/:id [delete]
exports.deleteOrder = catchAsyncErrors(
    async (req , res ,next) => {
        const order = await Order.findById(req.params.id)

        if(!order) {
            return next(new ErrorHandler('No Order found with this Id' , 404))
        }

        await order.deleteOne()

        res.status(200).json({
            success: true,
            message: "Order deleted successfully",
        });

    }
)