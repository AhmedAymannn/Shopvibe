const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const orderController = require('../controllers/oreder');

router.use(authMiddleware.protectWithHeaders)
router.route('/')
    .get(orderController.getMyOrders)
    .post(orderController.createOrder)
router.route('/:id')
    .get(orderController.getOrder)
    .patch(orderController.updateMyOrder)
    .delete(orderController.cancelMyOrder)


module.exports = router