const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');
const authMiddleware = require('../middleware/authMiddleware')
const upload = require('../middleware/upload');
router.route('/')
    .get(categoryController.getCategories) 
    .post(authMiddleware.protectWithHeaders,
        authMiddleware.restrictTo('admin'),
        upload('categories').single('image'),
        categoryController.addCategory); 

router.route('/:id')
    .get(categoryController.getCategory)
    .patch(authMiddleware.protectWithHeaders,
        authMiddleware.restrictTo('admin'),
        categoryController.updateCategryBody)

    .delete(authMiddleware.protectWithHeaders,
        authMiddleware.restrictTo('admin'),
        categoryController.deleteCategory)

router.patch('/updateCategoryImage/:id' ,authMiddleware.protectWithHeaders,
    authMiddleware.restrictTo('admin'),
    upload('categories').single('image'),
    categoryController.updateCategoryImage
)
module.exports = router;
