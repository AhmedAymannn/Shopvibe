const Product = require('../models/product');
const imagesHelper = require('../utils/imagesHelper');

exports.createProduct = async (body, coverImageFile, imagesFiles) => {
    const { name, description, price, stock, specifications, sold, discount, availability, summary, category } = body;
    const coverImage = await imagesHelper.uploadSingleImage(coverImageFile, 'products');
    const images = await imagesHelper.uploadImages(imagesFiles, 'products', 5);
    const product = await Product.create({
        name,
        description,
        price,
        stock,
        specifications,
        sold,
        discount,
        availability,
        summary,
        category,
        coverImage,
        images
    });
    return product;
}
exports.getProduct = async (productId) => {
    if (!productId) throw new Error('product Id Is Required');
    const product = await Product.findById(productId);
    if (!product) throw new Error('product Not Found');
    return product
}
exports.getProducts = async () => {
    const products = await Product.find()
    if (!products) throw new Error('Product Collection not found');
    return products;
}
exports.deleteProduct = async (productId) => {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product Not Found');
    const productImages = [...product.images, product.coverImage];
    const deletedImages = await imagesHelper.deleteImages('products', productImages);
    await product.deleteOne();
    return deletedImages;
}
exports.updateCoverImage = async (productId, newImageFile) => {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');
    const oldImageUrl = product.coverImage; 
    console.log(`from service > ${oldImageUrl}`);
    const updatedCoverImage = await imagesHelper.updateSingleImage(newImageFile, 'products', oldImageUrl);
    console.log(updatedCoverImage);
    product.coverImage = updatedCoverImage;
    await product.save();
    return product;
}
exports.updatedProductBody = async (productId, body) => {
    const product = await Product.findByIdAndUpdate(productId, body);
    if (!product) throw new Error('Product Not found');
    return product;
}
exports.updateProductImages = async (productId, newImagesFiles) => {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');
    const oldImagesUrls = product.images;
    if (oldImagesUrls.length === 0) {
        console.log(`No previous images found for product ${product.name}.`);
    }
    console.log(`from updateService=> ${oldImagesUrls}`);
    const updatedImages = await imagesHelper.updateImages(newImagesFiles, 'products', 5, oldImagesUrls);
    console.log(`from updateService=> ${updatedImages}`)
    product.images = updatedImages;
    await product.save();
    return product;
}


