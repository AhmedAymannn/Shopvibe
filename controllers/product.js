const Product = require('../models/product');
const fs = require('fs');
const path = require('path');
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().select("-__v");
        if (!products) {
            return res.status(200).json({
                message: 'No products'
            })
        }
        res.status(201).json({
            status: 'success',
            result: products.length,
            Data: {
                products
            }
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
exports.getProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) {
            return res.status(400).json({
                status: "error",
                message: "Product id is required"
            })
        }
        const product = await Product.findById(productId).select("-__v");
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }
        res.status(200).json({
            status: 'success',
            Data: {
                product
            }
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
exports.addProduct = async (req, res) => {
    try {
        const productData = req.body;
        if (!productData) {
            return res.status(400).json({
                status: 'faild',
                message: ' provid the product data to add'
            })
        }
        const product = await Product.create(productData);
        if (!product) {
            return res.status(400).json({
                status: 'faild',
                message: ' product did not added'
            })
        }
        res.status(201).json({
            status: 'success',
            Data: {
                product
            }
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!product) {
            return res.status(400).json({
                status: 'faild',
                message: ' product not found'
            })
        }
        res.status(200).json({
            status: 'success',
            message: 'product updated successfully',
            Data: {
                product
            }
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.deleteProduct = async (req, res) => {
    try {

        const product = await Product.findByIdAndDelete(req.params.id)
        if (!product) {
            return res.status(400).json({
                status: 'faild',
                message: ' product not found'
            })
        }
        res.status(200).json({
            status: 'success',
            message: 'product deleted successfully',
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.updateCoverImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 'faild',
                message: ' choose a file'
            })
        }
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(400).json({
                status: 'faild',
                message: 'Product not found'
            })
        }
        const oldImageUrl = path.join(__dirname, `../public${product.coverImage}`);
        const newImageUrl = `/images/covers/${req.file.filename}`
        product.coverImage = newImageUrl;
        await product.save();
        if (fs.existsSync(oldImageUrl)) {
            fs.unlinkSync(oldImageUrl);
        }
        res.status(200).json({
            message: 'cover image uploaded',
            coverImage: req.file.filename
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.uploadProductImages = async (req, res) => {
    try {
        if (!req.files) {
            return res.status(400).json({
                status: 'faild',
                message: ' upload images'
            })
        }
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(400).json({
                status: 'faild',
                message: ' product not found'
            })
        }
        if (product.images) {
            product.images.forEach(imagePath => {
                fullPath = path.join(__dirname, `../public/${imagePath}`);
                console.log(fullPath);    
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });
        }
        const newImagesUrls = req.files.map(file => `/images/products/${file.filename}`);
        console.log(newImagesUrls);
        
        product.images = [...newImagesUrls];
        await product.save();
        res.status(201).json({
            status: 'success',
            message: 'the images uploaded successfully',
            Data: {
                newImagesUrls
            }
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}