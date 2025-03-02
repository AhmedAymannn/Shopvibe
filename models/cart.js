const mongoose = require('mongoose');
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

}, { timestamps: true , toJSON: { virtuals: true }, toObject: { virtuals: true }});
// vivrtual calculating the final price 
cartSchema.virtual('totalPrice').get(function () {
    if (!this.cartItems) return 0;
    return this.cartItems.reduce((sum, item) => {
        return sum + (item.productId?.finalPrice ?? 0) * item.quantity;
    }, 0);
});

// Pre-find hook to populate `cartItems.productId` with `finalPrice price discount`
cartSchema.pre(/^find/, function (next) {
    this.populate('cartItems.productId', 'finalPrice price discount name'); // Ensures `finalPrice` is available
    next();
});


const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;