const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        unique: true
    },
    categoryType: { type: String, enum: ["Main", "Sub", "Sub-Sub"], required: true },
    parent: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
}, { timeseries: true })
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;