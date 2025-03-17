const Product = require('../models/product');
const fs = require('fs');
const path = require('path');
const responses = require('../utils/responses');
const productService = require('../services/productService')
exports.getProducts = async (req, res) => {
    try {
        const products = await productService.getProducts();
        responses.ok(res, ` All Products`, { result: products.length, products })
    } catch (error) {
        responses.serverError(res, error);
    }
}
exports.getProduct = async (req, res) => {
    try {
        if (!req.params.id) return responses.badRequest(res, 'Product Id paramater is required')
        const product = await productService.getProduct(req.params.id);
        responses.ok(res, `product ${product.name}`, { product });
    } catch (error) {
        responses.serverError(res, error);
    }
}
exports.addProduct = async (req, res) => {
    try {
        if(!req.body) return responses.badRequest(res , 'Bad Request');
        try {
            req.body.specifications = JSON.parse(req.body.specifications);
        } catch (error) {
            return responses.badRequest(res, 'Invalid specifications format. Ensure it is valid JSON.');
        }
        const coverImageFile = req.files.coverImage ? req.files.coverImage[0] : null;
        const imagesFiles = req.files.images || [];
        const product = await productService.createProduct(req.body , coverImageFile ,imagesFiles);
        responses.created(res , `Product Created` , {product})
    } catch (error) {
        responses.serverError(res, error);
    }
}
exports.updateProductBody = async (req, res) => {
    try {
        if(req.file) return responses.badRequest(res , `This End Point Is Only For Updating Body`);
        if(!req.params.id || !req.body) return responses.badRequest(res , `Product Id And Body Is Required`);
        const updatedProduct = await productService.updatedProductBody(req.params.id, req.body); 
        responses.ok(res , `${updatedProduct.name} Body Updated` , {updatedProduct});
    } catch (error) {
        responses.serverError(res, error);
    }
}
exports.updateCoverImage = async (req, res) => {
    try {
        if(!req.params.id || !req.file) return responses.badRequest(res , `Bad Request`);
        const updatedProduct = await productService.updateCoverImage(req.params.id , req.file);
        responses.ok(res ,`product ${updatedProduct.name} updated` , {updatedProduct});
    } catch (error) {
        responses.serverError(res, error);
    }
}
exports.updateProductImages = async (req, res) => {
    try {
        if(!req.params.id || !req.files) return responses.badRequest(res , `Bad Request`);
        const updatedProduct = await productService.updateProductImages(req.params.id , req.files);
        responses.ok(res , `${updatedProduct.name} Images Updated ` ,{updatedProduct})
    } catch (error) {
        responses.serverError(res, error);
    }
}
exports.deleteProduct = async (req, res) => {
    try {
        if(!req.params.id) return responses.badRequest(res ,`Product Id Is Required`);
        await productService.deleteProduct(req.params.id);
        responses.ok(res , `Product Deleted` ,{});
    } catch (error) {
        responses.serverError(res, error);
    }
}
