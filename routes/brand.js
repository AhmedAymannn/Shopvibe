const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const brandController = require('../controllers/brand');
const upload = require('../middleware/upload.js')

router.route('/')
    .get(brandController.getBrands)

    .post(authMiddleware.protectWithHeaders,
    authMiddleware.restrictTo('admin'),
    upload('brands').single('image'),
        brandController.addBrand);

router.route('/:id')
    .get(brandController.getBrand)

    .patch(authMiddleware.protectWithHeaders,
        authMiddleware.restrictTo('admin'),
        brandController.updateBrandBody)

    .delete(authMiddleware.protectWithHeaders,
        authMiddleware.restrictTo('admin'),
        brandController.deleteBrand);


router.patch('/updateBrandImage/:id',
    authMiddleware.protectWithHeaders,
    authMiddleware.restrictTo('admin'),
    upload('brands').single('image'),
    brandController.updateBrandImage
)


module.exports = router;
