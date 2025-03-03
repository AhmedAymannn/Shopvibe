const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const brandController = require('../controllers/brand');


router.route('/')
    .get(brandController.getBrands)
    .post(authMiddleware.protectWithHeaders,
    authMiddleware.restrictTo('admin'),
        brandController.createBrand);

router.route('/:id')
    .get(brandController.getBrand)
    .patch(authMiddleware.protectWithHeaders,
        authMiddleware.restrictTo('admin'),
            brandController.UpdateBrand)
    .delete(authMiddleware.protectWithHeaders,
        authMiddleware.restrictTo('admin'),
            brandController.DeleteBrand)

module.exports = router;
