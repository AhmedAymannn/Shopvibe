const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');
const authMiddleware = require('../middleware/authMiddleware')

router.route('/')
    .get(categoryController.getCategories) 
    .post(authMiddleware.protectWithHeaders,
        authMiddleware.restrictTo('admin'),
        categoryController.addCategory); 



router.route('/:id')
    .get(categoryController.getCategory)
    .patch(authMiddleware.protectWithHeaders,
        authMiddleware.restrictTo('admin'),
        categoryController.updateCategry)

    .delete(authMiddleware.protectWithHeaders,
        authMiddleware.restrictTo('admin'),
        categoryController.deleteCategory)


module.exports = router;
