const responses = require('../utils/responses');
const Order = require('../models/order')
const Product = require('../models/product')
const orderService = require('../services/orderService');
// admins only 
exports.getAllOrders = async (req, res) => {
    try {
        await orderService.getAllOrders(req.user._id , res) 
    } catch (error) {
        responses.serverError(res, error);
    }
}
// Get a specific order by ID (only if the user owns it) 
exports.getOrder = async (req, res) => {
    try {
        await orderService.getOrder(req.user._id , req.params.id , res)
    } catch (error) {
        responses.serverError(res, error);
    }
}
exports.getMyOrders = async (req, res) => {
    try {
    await orderService.getMyOrders(req.user._id , res) 
    } catch (error) {
        responses.serverError(res, error);
    }
}
exports.createOrder = async (req, res) => {
    try {
        await orderService.createOrder(req.user._id , req.body , res);
    } catch (error) {
        responses.serverError(res, error);
    }
}
// Update shipping address (only if Pending)
exports.updateMyOrder = async (req, res) => {
    try {
    await orderService.updateMyOrder(req.user._id , req.params.id , req.body ,res);
    } catch (error) {
        responses.serverError(res, error);
    }
}
// Cancel an order (only if Pending/Processing)
exports.cancelMyOrder = async (req, res) => {
    try {
        await orderService.cancelMyOrder(req.user._id, req.params.id, res);

    } catch (error) {
        responses.serverError(res, error);
    }
}