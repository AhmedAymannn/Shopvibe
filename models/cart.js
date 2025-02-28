const mongoose = require('mongoose');
const User = require('./user');
const Product = require('./product');


const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    cartItems: [
        {
            _id: false,
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, min: 1, required: true },
        }
    ],
    totalPrice: {
        type: Number
    }
}, { timestamps: true });


cartSchema.pre(/^find/, async function (next) {
    console.log(this.totalPrice);
    
    this.populate('cartItems.productId', 'price discount finalPrice');
    next();
});
cartSchema.pre('save', async function (next) {
    await this.populate("cartItems.productId", "price finalPrice");
    // get the cartItems , productid , quantity*price
    let totalPrice = 0;
    this.cartItems.forEach(item => {
        totalPrice += item.productId.finalPrice * item.quantity;
    })
    this.totalPrice = totalPrice;
    next();
})
const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;