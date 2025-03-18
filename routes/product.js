const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const reviewRouter = require('../routes/review');
const authMiddleware = require('../middleware/authMiddleware')
const upload = require('../middleware/upload')



router.use('/:productId/reviews', reviewRouter);

router.route('/')
    .get(productController.getProducts)
    .post(authMiddleware.protectWithHeaders,
        authMiddleware.restrictTo('admin'),
        upload('products').fields([
            { name: 'coverImage', maxCount: 1 },  
            { name: 'images', maxCount: 5 }       
        ]),
        productController.addProduct)

router.route('/:id')
    .get(productController.getProduct)

    .patch(authMiddleware.protectWithHeaders,
        authMiddleware.restrictTo('admin'),
        productController.updateProductBody)

    .delete(authMiddleware.protectWithHeaders,
        authMiddleware.restrictTo('admin'),
        productController.deleteProduct)

router.patch('/coverImageUpdate/:id',
    authMiddleware.protectWithHeaders,
    authMiddleware.restrictTo('admin'),
    upload('products').single('coverImage'),
    productController.updateCoverImage
)

router.patch('/updateProductImages/:id',
    authMiddleware.protectWithHeaders,
    authMiddleware.restrictTo('admin'),
    upload('products').array('images',5),
    productController.updateProductImages
)

module.exports = router;

