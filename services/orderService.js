const Order = require('../models/order');
const responses = require('../utils/responses');

exports.createOrder = async (userId, body, res) => {
    try {
        const { orderItems, shippingAddress, payment } = body;
        if (!orderItems?.length || !shippingAddress || !payment?.method) {
            return responses.badRequest(res, 'complete the body ');
        }
        const order = await Order.create({
            user: userId,
            orderItems,
            shippingAddress,
            payment: { method: payment.method },
        });
        responses.created(res, `Order Created successfully`, { order });
    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
}
exports.getMyOrders = async (userId, res) => {
    try {
        const orders = await Order.find({ user: userId });
        if (!orders) return responses.notFound(res, 'You Dont Have Orders');
        responses.ok(res, ` Orders`, { "Result":orders.length , orders });
    } catch (error) {
        return { error: error.message };
    }
}
// admins only 
exports.getAllOrders = async (res) => {
    try {
        const orders = await Order.find();
        responses.ok(res, 'All Orders', { orders })
    } catch (error) {
        return { error: error.message };
    }
}
// Get a specific order by ID (only if the user owns it) 
exports.getOrder = async (userId, orderId, res) => {
    try {
        if (!orderId) return responses.badRequest(res, 'you forgot order id');
        const order = await Order.findOne({ user: userId, _id: orderId });
        if (!order) return responses.notFound(res, 'order not found');
        responses.ok(res, 'Order Deails', { order })
    } catch (error) {
        return { error: error.message };
    }
}
// Update shipping address (only if Pending)
exports.updateMyOrder = async (userId, orderId, body, res) => {
    try {
        const { shippingAddress } = body;
        if (!userId || !orderId) return responses.badRequest(res, `Request body is incomplete`);
        // only if status of the order is pendding
        const order = await Order.findOne({ _id: orderId, user: userId });
        if (!order) return responses.notFound(res, 'order not found');
        if (order.status !== 'pending') {
            return responses.conflict(res, `You Can't Update Order After Pendding`);
        };
        // only the shipping address is updated 
        order.shippingAddress = shippingAddress;
        await order.save();
        responses.ok(res, 'Order Updated');
    } catch (error) {
        return { error: error.message };
    }
}
// Cancel an order (only if Pending/Processing)
exports.cancelMyOrder = async (userId, orderId, res) => {
    try {
        if (!userId || !orderId) return responses.badRequest(res, 'request is not complete');
        const statusAllawd = ["Shipped", "Delivered", "Cancelled"];
        const order = await Order.findOne({ _id: orderId, user: userId });
        if (!order) return responses.notFound(res, `Order Not Found`);
        if (statusAllawd.includes(order.status)) {
            return responses.conflict(res, `you can't cancel order after shipping`);
        }
        await order.deleteOne();
        responses.ok(res, 'order canceled successfully');
    } catch (error) {
        return { error: error.message };
    }
}