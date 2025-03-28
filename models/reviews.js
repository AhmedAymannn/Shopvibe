const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    user : {type: mongoose.Schema.Types.ObjectId , ref : 'User' , required : true},
    product : {type: mongoose.Schema.Types.ObjectId , ref : 'Product' , required : true},
    review : {type : String , required : true , minlength : [10], maxlength: [50] },
},{ timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review ;