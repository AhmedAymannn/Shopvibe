const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment')
const authMiddleware = require('../middleware/authMiddleware')
router.route('/')
    .post(authMiddleware.protectWithHeaders , paymentController.createCheckOut)

router.get("/success" , paymentController.success);
router.get("/cancel",paymentController.cancel);

module.exports = router;