const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Product = require('../models/product');
const Order = require('../models/order');
exports.createCheckOut = async (orderId) => {
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Order Not Found');

    const session = await stripe.checkout.sessions.create({
        payment_method_types: [order.payment.method],
        line_items: order.orderItems.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: { name: item.name, description: item.description },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        })),
        metadata: { orderId: order._id.toString() },
        mode: "payment",
        success_url: `http://localhost:3000/api/v1/ecommerce/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: "http://localhost:3000/api/v1/ecommerce/checkout/cancel",
    });
    return { id: session.id, url: session.url };
};

exports.success = async (sessionId) => {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) throw new Error("Session Not Found");

    const order = await Order.findById(session.metadata.orderId);
    if (!order) throw new Error("Order Not Found");

    console.log(`Payment Status: ${session.payment_status}`);

    const paymentStatusMap = {
        paid: "Paid",
        open: "Pending",
        expired: "Failed",
        canceled: "Cancelled",
    };

    order.payment.status = paymentStatusMap[session.payment_status] || "Pending";
    order.status = session.payment_status === "paid" ? "Processing" : "Pending";

    if (session.payment_status === "canceled") {
        order.cancelledAt = new Date();
    }

    await order.save();
};


// after hosting

// exports.webHook = async ( sig ) => {
//     const sig = req.headers["stripe-signature"]; // Get Stripe signature from headers
//     const endpointSecret = "your_webhook_secret"; // Set your Webhook Secret Key

//     let event;
//     try {
//         // Verify the event came from Stripe
//         event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//     } catch (error) {
//         return res.status(400).send(`Webhook error: ${error.message}`); // Send error response if verification fails
//     }

//     // Handle successful payment
//     if (event.type === "checkout.session.completed") {
//         const session = event.data.object;
//         console.log("✅ Payment successful for session:", session.id);

//         // ✅ Here, update your database to mark the order as "paid"
//         // Example: Order.updateOne({ sessionId: session.id }, { status: "paid" })
//     }
// }
