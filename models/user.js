const mongoose = require('mongoose');
const validator = require('validator');
const crypto= require('crypto');
const bcrypt = require('bcrypt');
const Cart = require('./cart')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'email missed'],
        unique: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email address'
        }
    },
    name: {
        type: String,
        required: true,
        min: 10,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    phone: {
        type: String
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    },
    active: {
        type: Boolean,
        default: true
    },   
    image : {type : String , default : `public/default_image_.png`},
    passwordChangedAt : Date,
    passwordResetToken : String,
    passwordResetExpires : Date ,

}, { 
    timestamps: true ,
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
});

userSchema.pre('save',async function (next) {
    if (!this.isModified('password')) return next(); 
    try {
    const hashedPassword = await bcrypt.hash(this.password , 10);
    this.password = hashedPassword;
    this.passwordChangedAt = Date.now();
    next();
    } catch (error) {
        next(error)
    }
})

userSchema.methods.correctPassword = async function (candidatePassword ,password){
    return await bcrypt.compare(candidatePassword ,password );
}

userSchema.methods.createResetToken = async  function (){
    const resetToken = crypto.randomBytes(32).toString();
    this.passwordResetToken =  crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await  this.save();
    return this.passwordResetToken ;
}
userSchema.pre(/^find/, function(next) {
    this.populate('orders').populate('wishlist')
        .select('-__v -createdAt -updatedAt -passwordChangedAt');
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;