const Brand = require('../models/brand');
const imagesHelper = require('../utils/imagesHelper');

// Create a new brand
exports.createBrand = async (body, file) => {
    const { name, category } = body;
    if (!name || !category) throw new Error('Brand name, category , and image are required');
    const brandImage = await imagesHelper.uploadSingleImage(file, 'brands');
    const brand = await Brand.create({ name, category, image: brandImage });
    return brand;
};

// Get all brands
exports.getBrands = async () => {
    const brands = await Brand.find();
    if (!brands) throw new Error('Brands not found');
    return brands;
};

// Get a single brand by ID
exports.getBrand = async (brandId) => {
    const brand = await Brand.findById(brandId);
    if (!brand) throw new Error('Brand not found');
    return brand;
};

// Update brand details (excluding image)
exports.updateBrandBody = async (brandId, body) => {
    const { name, category } = body;
    const updatedBrand = await Brand.findByIdAndUpdate(
        brandId,
        { name, category },
        { new: true, runValidators: true }
    );
    if (!updatedBrand) throw new Error('Brand not found');
    return updatedBrand;
};

// Update brand image
exports.updateBrandImage = async (brandId, file) => {
    if (!file || !brandId) throw new Error('File and Brand ID are required');
    const brand = await Brand.findById(brandId);
    if (!brand) throw new Error(`Brand with ID ${brandId} not found`);
    const oldImageUrl = brand.image;
    const newImageUrl = await imagesHelper.updateSingleImage(file, 'brands', oldImageUrl);
    brand.image = newImageUrl;
    await brand.save();
    return brand;
};

// Delete brand and its image
exports.deleteBrand = async (brandId) => {
    const brand = await Brand.findById(brandId);
    if (!brand) throw new Error('Brand not found');

    const imageUrl = brand.image;
    await imagesHelper.deleteSingleImage('brands', imageUrl);
    await brand.deleteOne();
    return true;
};