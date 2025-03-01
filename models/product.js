const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'You are missing the product name'], maxlength: [50] },
    description: { type: String, required: [true, 'You are missing the product description'], minlength: [20, 'Description must be at least 20 characters long'], },
    coverImage: { type: String, default: 'images/default_image_.png' },
    images: [{ type: String }],
    price: { type: Number, required: true, min: [0, 'Price cannot be negative'] },
    finalPrice : {type: Number, min: [0, 'Price cannot be negative']},
    stock: { type: Number, required: true },
    specifications: { type: Object, default: {} },
    sold: { type: Number, default: 0 },
    discount: { type: Number, min:0 , max :100 , default : 0 },
    availability: { type: String, enum: ['In Stock', 'Out of Stock', 'Preorder'], default: 'In Stock' },
    summary: { type: String, required: true, maxlength: [100, 'Summary cannot exceed 100 characters'] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
}, { timestamps: true });

// calculate the finalPrice before saving 
productSchema.pre('save', function (next) {
    if (this.discount && this.discount > 0) {
        this.finalPrice = this.price - (this.price * this.discount / 100);
    } else {
        this.finalPrice = this.price; // No discount applied
    }
    console.log(`from product pre save hook ${this.finalPrice}`);
    next();
});
// calculate the finalPrice after updateOne
productSchema.pre('findOneAndUpdate',async  function (next) {
    let result = this.getUpdate();
    if (!result.price && !result.discount) return next();
    console.log("Before Modification:" ,result);
    const product =await  Product.findOne(this.getQuery());
    if(!product) return next();
    const newPrice = result.price ?? product.price; ;
    const newDiscount = result.discount ?? product.discount;
    result.finalPrice = newPrice - (newPrice * (newDiscount / 100));
    console.log("After Modification:", result);
    next();
    
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

