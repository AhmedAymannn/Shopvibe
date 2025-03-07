const paymentService = require('../services/paymentService');
const responses = require('../utils/responses');

exports.createCheckOut = async (req, res) => {
    try {
        const { orderId } = req.body;
        const session = await paymentService.createCheckOut(orderId);
        console.log(session);
        responses.created(res, 'checkout Session Created', { session })
    } catch (error) {
        responses.serverError(res, error)
    }
}

exports.success = async (req, res) => {
    try {
        const sessionId = req.query.session_id;
        await paymentService.success(sessionId);
        responses.ok(res, "Payment successful! Order confirmed", {});
    } catch (error) {
        responses.serverError(res, error);
    }
}

exports.cancel = async (req, res) => {
    try {
        responses.ok(res,`Payment cancellde !` ,{})

    } catch (error) {
        responses.serverError(res, error)
    }
}