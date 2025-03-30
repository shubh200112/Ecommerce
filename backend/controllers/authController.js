const User = require('../models/user')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')

const sendToken = require('../utils/jwtToken')
const { router } = require('../app')

//Register a user => /api/v1/register [post]
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

        
        sendToken(user ,200 , res)
       
    }
)

// Login a user => /api/v1/login [post]

exports.loginUser = catchAsyncErrors (
    async (req,res ,next) => {
        const {email , password} = req.body

        //check if email and password is entered by user
        if(!email || !password) {
            return next (new ErrorHandler('Please enter email & password',400))
        }

        //Finding user in database
        const user = await User.findOne({email}).select('+password')
        
        //If user doesnot exist in the database
        if(!user) {
            return next(new ErrorHandler('Invalid email or Password',401))

        }

        //check if password is same or not
        const isPasswordMatched = await user.comparePassword(password)
    
        if(!isPasswordMatched) {
            return next(new ErrorHandler('Invalid email or Password',401))
        }

        sendToken(user ,200 , res)
    
    }
)

//Logout User => /api/v1/Logout [GET]
exports.logout = catchAsyncErrors(
    async (req ,res ,next) => {
        res.cookie('token',null , {
            expires: new Date(Date.now()),
            httpOnly: true
        })

        res.status(200).json({
            success : true,
            message: 'Logged Out'
        })
    }
)

//Get currently logged=in user details => /api/v1/me [GET]
exports.getUserProfile = catchAsyncErrors(
    async (req, res , next) =>{
        const user =await User.findById(req.user.id)

        res.status(200).json({
            success: true,
            user
        })
    }
        
)

// Update or change password => /api/v1/password/update [PUT]
exports.updatePassword = catchAsyncErrors(
    async (req, res , next) =>{
        const user =await User.findById(req.user.id).select('+password')

        // Check previous password and allow the user to change or modify password
        const isMatched = await user.comparePassword(req.body.oldPassword)

        if(!isMatched) {
            return next(new ErrorHandler('old Password does not match',401))

        }

        user.password =req.body.password

        await user.save()

        sendToken(user , 200 ,res)

    }
        
)

//Update user profile => /api/v1/update [PUT]
exports.updateProfile = catchAsyncErrors(
    async (req, res , next) =>{
       const newUserData = {
        name: req.body.name,
        email: req.body.email
       }
       // update avatar : TODO

       const user = await User.findByIdAndUpdate(req.user.id , newUserData , {
        useFindAndModify: false //jb bhi depreciating error ayega tbye use karna
       })
       
       res.status(200).json({
        success: true,
        user
     })
  }
)

// Admin Routes 

// Get all users => /api/v1/admin/users
exports.allUsers = catchAsyncErrors(
    async (req, res , next) =>{
        const user =await User.find()

        res.status(200).json({
            success: true,
            user
        })
    }
        
)

// Get a single user => /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(
    async (req, res , next) =>{
        const user =await User.findById(req.params.id)

        if(!user) {
            return next (new ErrorHandler('User does not found !!',404))

        }
        res.status(200).json({
            success: true,
            user
        })
    }
        
)

// Update User profile by admin => /api/v1/admin/update/:id
exports.updateUser = catchAsyncErrors(
    async (req ,res ,next) =>{
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role
        }

        const user = await User.findByIdAndUpdate(req.params.id , newUserData ,{
            useFindAndModify :false
        })

        res.status(200).json({
            success: true,
            user
        })
    }
)

// Delete user => /api/v1/admin/user/:id [PUT]
exports.deleteUser = catchAsyncErrors(
    async (req ,res ,next) => {
        const user =await User.findById(req.params.id)

        if(!user) {
            return next (new ErrorHandler('User not found !!',404))

        }

        //Remove avatar from Cloudinary [TODO]

        await user.deleteOne()
        
        res.status(200).json({
            success: true
        })
    }
)


