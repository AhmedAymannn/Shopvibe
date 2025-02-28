const express = require('express')
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const cartController = require('../controllers/cart');



router.route('/allcarts')
    .get(authMiddleware.protectWithHeaders,
        authMiddleware.restrictTo('admin'),
        cartController.getAllCarts)


router.route('/mycart')
    .get(authMiddleware.protectWithHeaders, cartController.getMyCart)
    .delete(authMiddleware.protectWithHeaders, cartController.deleteAllItems)

router.route('/mycart/:id')
    .post(authMiddleware.protectWithHeaders, cartController.addToCart)
    .delete(authMiddleware.protectWithHeaders, cartController.deleteItem)


router.route('/mycart/decrease/:id')
    .delete(authMiddleware.protectWithHeaders, cartController.decreaseItem);



module.exports = router;