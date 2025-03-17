const Category = require('../models/category');
const responses = require('../utils/responses');
const categoryService = require('../services/categoryService');
// get the main categories only 
exports.getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getCategories();
        responses.ok(res, `All Categories `, { result: categories.length, categories });
    } catch (error) {
        responses.serverError(res, error)
    }
}
// add main or sub category
//router.route('/api/v1/ecommerce/categories/')+ the parent id in the body (if sub)
exports.addCategory = async (req, res) => {
    try {
        if (!req.body || !req.file) return responses.badRequest(`Body And File Is Required`);
        const category = await categoryService.createCategory(req.body, req.file);
        responses.created(res, `${category.name} Created Successfully`, { category });
    } catch (error) {
        responses.serverError(res, error)
    }
}
// get the main category by id > with sub category name 
//router.route('/api/v1/ecommerce/categories/') 
exports.getCategory = async (req, res) => {
    try {
        if (!req.params.id) return responses.badRequest(res, 'Bad Request Add The Id To Get The Category ');
        const category = await categoryService.getCategory(req.params.id);
        responses.ok(res, ` ${category.name}`, { category })
    } catch (error) {
        responses.serverError(res, error);
    }
};

// update name , parent
exports.updateCategryBody = async (req, res) => {
    try {
        if (!req.params.id || !req.body) return responses.badRequest(res, 'Bad Request Add The Id To Get The Category ');
        const updatedCategory = await categoryService.updateCategryBody(req.params.id, req.body);
        responses.ok(res, `${updatedCategory._id} updated`, { updatedCategory });
    } catch (error) {
        responses.serverError(res, error);
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const category = await categoryService.deleteCategory(req.params.id);
        if (!category) return responses.notFound(res, 'Category Not Found');
        responses.ok(res, `The Category Deleted`, {});
    } catch (error) {
        responses.serverError(res, error);
    }
}

exports.updateCategoryImage = async (req, res) => {
    try {
        if (!req.params.id || !req.file)
            return responses.badRequest(res, 'Category ID and image file are required ');
        const updatedCategory = await categoryService.updateCategoryImage(req.params.id, req.file);
        if (!updatedCategory)
            return responses.notFound(res, `Category with ID ${id} not found`);
        responses.ok(res, `${updatedCategory._id} Image has been updated `, { updatedCategory });
    } catch (error) {
        responses.serverError(res, error);
    }
}