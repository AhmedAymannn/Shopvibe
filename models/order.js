const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderItems: [
        {
            _id: false,
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            name: { type: String, required: true },  // Store product name at purchase time
            price: { type: Number, required: true }, // Store final price at purchase time
            quantity: { type: Number, required: true, min: 1 }
        }
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Pending"
    },
    payment: {
        method: { type: String, enum: ["COD", "Credit Card", "PayPal"], required: true },
        status: { type: String, enum: ["Pending", "Paid", "Failed", "Refunded"], default: "Pending" },
    },
    deliveredAt: { type: Date }, 
    cancelledAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
},
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
// 🔹 What This Order Schema Does
// ✅ Stores product details at purchase time (name, price)
// ✅ Saves total amount automatically
// ✅ Has order status & payment status
// ✅ Independent of Cart (order still exists if cart is deleted)
// ✅ Includes shipping address

