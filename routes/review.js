const express = require('express');
const router = express.Router({ mergeParams: true });
const authMiddleware = require('../middleware/authMiddleware');
const reviewController = require('../controllers/review');



//POST /api/v1/products/:productId/reviews
router.route('/')
    .get(reviewController.getAllReviewsForProduct)
    .post(authMiddleware.protectWithHeaders , reviewController.createReviewOnProduct)
// api/products/productId/reviews/my-reviews
router.route('/me-reviews')
    .get(authMiddleware.protectWithHeaders , reviewController.getMyReviewsOnProduct)
    .put(authMiddleware.protectWithHeaders , reviewController.updateMyReviewOnProduct)
    .delete(authMiddleware.protectWithHeaders , reviewController.deleteMyReviewOnproduct)
    
// /api/v1/reviews/global => admins only 
router.route('/global')
    .get(authMiddleware.protectWithHeaders ,
        authMiddleware.restrictTo('admin'),
        reviewController.getAllReviewsGlobally
    );
//POST /api/v1/reviews/id
router.route('/:reviewId')
    .get(authMiddleware.protectWithHeaders , reviewController.getReviewById)

module.exports = router;