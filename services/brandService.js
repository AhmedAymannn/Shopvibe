const Brand = require('../models/brand');
const Category = require('../models/category');
const responses = require('../utils/responses');

exports.getBrands = async (res) => {
    try {
        const brands = await Brand.find();
        responses.ok(res, 'All Brands', { Result: brands.length, brands });
    } catch (error) {
        return { error: error.message };
    }
};

exports.getBrand = async (brandId, res) => {
    try {
        if (!brandId) return responses.badRequest(res, 'Add Brand Id In Parameter');
        const brand = await Brand.findById(brandId);
        if (!brand) return responses.notFound(res, 'Brand Not Found');
        responses.ok(res, `${brand.name}`, { brand });
    } catch (error) {
        return { error: error.message };
    }
};

exports.createBrand = async (body, res) => {
    try {
        const { name, category } = body;
        if (!name || !category) return responses.badRequest(res, 'Complete request body: name and categoryId are required');    
        const categoryExists  = await Category.findById(category);
        if (!categoryExists ) return responses.notFound(res, 'Category not found');

        const brand = await Brand.create({ name, category });
        responses.created(res, 'Brand Created successfully', { brand });
    } catch (error) {
        return { error: error.message };
    }
};

exports.updateBrand = async (body,brandId, res) => {
    try {
        if (!brandId) return responses.badRequest(res, 'Brand ID is required');
        const { name, category } = body;
        if (!name && !category) return responses.badRequest(res, 'Provide at least one field to update');
        if (name === null || name === "") {
            return responses.badRequest(res, 'Name cannot be null or empty');
        }
        let updated = {};
        if (name !== undefined) updated.name = name;
        if (category !== undefined) updated.category = category;
        const updatedBrand = await Brand.findByIdAndUpdate(
            brandId,
            updated,
            { new: true, runValidators: true }
        );
        if (!updatedBrand) return responses.notFound(res, 'Brand Not Found');
        responses.ok(res, 'Updated successfully', { updatedBrand });
    } catch (error) {
        return { error: error.message };
    }
};

exports.DeleteBrand = async (brandId, res) => {
    try {
        if (!brandId) return responses.badRequest(res, 'Add The Id Of Brand To Parameter');
        const brand = await Brand.findByIdAndDelete(brandId);
        if (!brand) return responses.notFound(res, 'Brand Not Found');
        responses.ok(res, 'Deleted successfully', {});
    } catch (error) {
        return { error: error.message };
    }
};
