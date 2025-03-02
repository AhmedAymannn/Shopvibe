const mongoose = require('mongoose');
const Product = require('./product');
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    totalAmount: { type: Number },// dynamiclly
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
    deliveredAt: { type: Date }, // dynamiclly
    cancelledAt: { type: Date }, //dynamiclly
    createdAt: { type: Date, default: Date.now },
    orderItems: [
        {
            _id: false,
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            name: { type: String },  // Store product name at purchase time
            price: { type: Number }, // Store final price at purchase time
            quantity: { type: Number, min: 1, default: 1 }
        }
    ],
},
    { timestamps: true }
);
// calculating Total amount before saving 
orderSchema.pre('save', async function (next) {
    const productIds = [];
    this.orderItems.forEach(item => {
        productIds.push(item.productId);
    });
    const products = await Product.find({ _id: { $in: productIds } });
    if (!products) return next();
    products.forEach(product => {
        this.orderItems.forEach(item => {
            if (product._id.toString() === item.productId.toString()) {
                item.name = product.name
                item.price = product.finalPrice
            }
        });
    });
    let totalAmount = 0;
    this.orderItems.forEach(element => {
        totalAmount += element.price * element.quantity;
    })
    this.totalAmount = totalAmount;
})
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
