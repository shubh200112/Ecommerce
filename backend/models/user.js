const mongoose = require('mongoose')
const validator  = require('validator')
const bcrypt = require('bcryptjs')
const jwt  = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name : {
        type :String,
        required: [true,'Please enter your name'],
        maxlength: [30 , 'Your name cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique:true,
        validate: [validator.isEmail , 'Please enter valid email address']
    },
    password: {
        type:String,
        required: [true, 'Please enter your password'],
        minlength: [6 , 'Your password must be longer than 6 characters'],   
        select:false
    
    },
    avatar: {
        public_id: {
            type: String,
            required: [true, 'Image must have a public_id']
        },
        url: {
            type: String,
            required: [true, 'Image must have a URL']
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default : Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

//encrypting the password
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        next()
    }

    this.password = await bcrypt.hash(this.password , 10)
})

//generatig Jwt token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({id : this.id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

//Compare Password

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword , this.password)
}

// generate Password reset token

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    console.log("Generated Reset Token:", resetToken); // Debugging Step

    const hash = crypto.createHash("sha256").update(resetToken);
    console.log("Generated Hash (Before digest()):", hash); // Debugging Step

    this.resetPasswordToken = hash.digest("hex");
    console.log("Hashed Token:", this.resetPasswordToken); // Debugging Step

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    return resetToken;
};


module.exports = mongoose.model('user', userSchema);
