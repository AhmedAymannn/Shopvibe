const User = require('../models/user');
const Cart = require('../models/cart');
const Product = require('../models/product');
const mongoose = require('mongoose');
const responses = require('../utils/responses')


// get all carts => admins only 
exports.getAllCarts = async (req, res)=>{
    try {
        const carts = await Cart.find();
        if(!carts) return responses.notFound(res, 'no carts found');
        responses.ok(res , 'All Carts' , {result : carts.length , carts})

    } catch (error) {
        responses.serverError(res,error)
    }
}
exports.getMyCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("cartItems.productId", "name price");
        const data = {
            totalItems: cart.cartItems.length,
            totalPrice: cart.totalPrice || 0, 
            cartItems: cart.cartItems.map(item => ({
                productId: item.productId._id,
                name: item.productId.name,
                price: item.productId.price,
                quantity: item.quantity,
                subtotal: item.productId.price * item.quantity
            }))
        };
        responses.ok(res, data);

    } catch (error) {
        responses.serverError(res, error)
    }
}
exports.addToCart = async (req, res) => {
    try {
        const productId = req.params.id, userId = req.user.id;
        let cart = await Cart.findOne({ user: userId });
        // if user dont have cart , create a new one 
        if (!cart) {
            cart = await Cart.create({ user: userId });
        }
        const product = cart.cartItems.find(item => item.productId.toString() === productId);
        if (product) {
            product.quantity += 1;
        } else {
            cart.cartItems.push({ productId: productId, quantity: 1 });
        }
        await cart.save();
        res.status(200).json({
            message: 'the product added'
        })
    }   
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
exports.deleteAllItems = async (req, res) => {
    try {
        // using mongodb
        // const cart = await Cart.updateOne({ user: req.user.id }, { $set: { cartItems: [] } })
        // if (cart.modifiedCount === 0) {
        //     return res.status(404).json({
        //         status: "failed",
        //         message: '"You do not have any items to delete. '
        //     });
        // }
        const userId = req.user.id;
        // using js logic
        const cart = await Cart.findOne({ user: userId });
        if (!cart || cart.cartItems.length === 0) {
            return res.status(404).json({ status: 'failed', message: 'your cart already empty ' });
        }
        else {
            cart.cartItems = [];
        }
        await cart.save();

        res.status(200).json({
            status: 'success',
            message: 'All items deleted successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.deleteItem = async (req, res) => {
    try {
        const productId = req.params.id, userId = req.user.id;

        // using mongodb

        // const cart = await Cart.updateOne(
        //     // find the cart by userId ,, find the product by "cartItems.productId": productId 
        //     // , if no product , no changes in document
        //     { user: userId, "cartItems.productId": productId },
        //     //if there is product will change in doc , deleting the product   
        //     { $pull: { cartItems: { productId: productId } } });
        // if (cart.modifiedCount === 0) {
        //     return res.status(404).json({ status: "failed", message: "product not found" });
        // }


        // using js logic 
        const cart = await Cart.findOne({ user: userId });
        const productIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);
        if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
            return res.status(404).json({ status: 'failed', message: 'Product not found in cart' });
        }
        if (productIndex === -1) {
            return res.status(404).json({ status: 'failed', message: 'product not found ' });
        } else {
            cart.cartItems.splice(productIndex, 1);
        }
        await cart.save();
        res.status(200).json({
            status: 'success',
            message: 'product deleted'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.decreaseItem = async (req, res) => {
    try {
        const productId = req.params.id, userId = req.user.id;
        const cart = await Cart.findOne({ user: userId });
        const productIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);
        if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
            return res.status(404).json({ status: 'failed', message: 'Product not found in cart' });
        }
        if (productIndex === -1) {
            return res.status(404).json({ status: "failed", message: "Product not found in cart" });
        }
        if (cart.cartItems[productIndex].quantity > 1) {
            cart.cartItems[productIndex].quantity -= 1;
        }
        else {
            cart.cartItems.splice(productIndex, 1)
        }
        await cart.save();
        res.status(200).json({
            status: 'success',
            message: "Product removed from cart"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
