const mongoose = require('mongoose');
const brandSchema = new mongoose.Schema({
    name : {type : String , required :true},
    category : {type :mongoose.Schema.Types.ObjectId,ref : 'Category' , required :true},
});
brandSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'category',
        select: 'name' 
    });
    next();
});
const Brand = mongoose.model('Brand' , brandSchema);
module.exports = Brand;