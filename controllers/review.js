const Review = require('../models/reviews');
const Product = require('../models/product');
const User = require('../models/user');
const responses = require('../utils/responses');

//POST /api/v1/products/:productId/reviews
exports.createReviewOnProduct = async (req, res) => {
    try {
        const review = req.body.review;
        const { productId } = req.params;
        const userId = req.user.id;
        if (!review || !productId) return responses.badRequest(res, 'Bad Request');

        const existingReview = await Review.findOne({ user: userId, product: productId });
        if (existingReview) return responses.conflict(res, `You have already reviewed this product.`);

        const product = await Product.findById(productId);
        if (!product) return responses.notFound(res, `product not found`);

        const createdReview = await Review.create({ user: userId, review, product: productId });
        responses.created(res, `Your Review Created`, { createdReview })
    } catch (error) {
        responses.serverError(res, error);
    }
}
//Get all reviews (admin-only)
exports.getAllReviewsGlobally = async (req, res) => {
    try {
        const reviews = await Review.find().populate('user', 'name email').populate('product', 'name')
        responses.ok(res, `success`, { Result: reviews.length, reviews })
    } catch (error) {
        responses.serverError(res, error);
    }
}
//Get all reviews for a specific product => Get products/:productId/reviews
exports.getAllReviewsForProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) return responses.notFound(res, 'product not found');
        const reviews = await Review.find({ product: productId }).populate('user', 'name email');
        responses.ok(res, `success`, { Result: reviews.length, reviews })
    } catch (error) {
        responses.serverError(res, error);
    }
}
// specific review by id
exports.getReviewById = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await Review.findById(reviewId).populate('user', 'name email').populate('product', 'name');
        if (!review) return responses.notFound(res, `review not found`);
        responses.ok(res, 'succces', { review });
    } catch (error) {
        responses.serverError(res, error);
    }
}
// get My Own Reviews On The Product
exports.getMyReviewsOnProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) return responses.notFound(res, 'Product Not Found')
        const reviews = await Review.find({ product: productId, user: req.user.id }).populate('user', 'name email');;
        if (!reviews) return responses.notFound(res, `You Are Not Have Reviews for ${productId}`);
        responses.ok(res, `success`, { result: reviews.length, reviews });
    } catch (error) {
        responses.serverError(res, error);
    }
}

// Allow users to update their own review On The Product
exports.updateMyReviewOnProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;
        const { newReview } = req.body;
        const product = await Product.findById(productId);
        if (!product) return responses.notFound(res, 'product not found');
        const review = await Review.findOneAndUpdate({ product: productId, user: userId },
            { $set: { review: newReview } },
            { new: true })
            .populate('product', 'name');
        if (!review) return responses.notFound(res, `Review Not Found`);
        responses.ok(res, `updated`, { review })
    } catch (error) {
        responses.serverError(res, error);
    }
}
//Allow users to delete their own review on the product
exports.deleteMyReviewOnproduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;
        const product = await Product.findById(productId);
        if (!product) return responses.notFound(res, 'product not found');
        const deletedReview = await Review.findOneAndDelete({ product: productId, user: userId });
        if (!deletedReview) return responses.notFound(res, `Review Not Found`);
        responses.ok(res, `review deleted successfully`, {})
    } catch (error) {
        responses.serverError(res, error);
    }
}

