const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const reviewRouter = require('../routes/review');
const authMiddleware = require('../middleware/authMiddleware')
const upload = require('../middleware/upload')



router.use('/:productId/reviews' , reviewRouter);


// middlewere to handle the images
router.patch('/coverImageUpload/:id',
    authMiddleware.protectWithHeaders,
    authMiddleware.restrictTo('admin'),
    upload('covers').single('cover-image'),
    productController.updateCoverImage
)
// upload the product images , max 3 images
router.post('/uploadProductImages/:id',
    authMiddleware.protectWithHeaders,
    authMiddleware.restrictTo('admin'),
    upload('products').array('product-images', 3),
    productController.uploadProductImages);

router.route('/')
    .get(productController.getProducts)
    .post(authMiddleware.protectWithHeaders,
        authMiddleware.restrictTo('admin'),
        productController.addProduct)

router.route('/:id')
    .get(authMiddleware.protectWithHeaders,
        productController.getProduct)

    .patch(authMiddleware.protectWithHeaders,
        authMiddleware.restrictTo('admin'),
        productController.updateProduct)

    .delete(authMiddleware.protectWithHeaders,
        authMiddleware.restrictTo('admin'),
        productController.deleteProduct)

// router.post('/uploadCoverImage/:id', productController.uploadCoverImage)

module.exports = router;

