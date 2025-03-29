const User = require('../models/user')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')

//Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors(
    async(req , res , next) => {
        const {name , email , password } = req.body



        const user = await User.create({
            name,
            email,
            password,
            avatar : {
                public_id : 'ID',
                url: 'URL'
            }

        })

        const token = user.getJwtToken()

        res.status(200).json({
            success: true,
            token
        })
    }
)

// Login a user => /api/v1/login

exports.loginUser = catchAsyncErrors (
    async (req,res ,next) => {
        console.log(req.body)
    }
)
