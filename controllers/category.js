const Category = require('../models/category');
const responses = require('../utils/responses');

// get the main categories only 
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('parent', '_id name');
        if (categories.length === 0) return responses.notFound(res, 'categories not found');
        responses.ok(res, `All Categories `, { result: categories.length, categories });
    } catch (error) {
        responses.serverError(res, error)
    }
}
// add main or sub or sub of sub category
//router.route('/api/v1/ecommerce/categories/')+ the parent id in the body (if sub)

exports.addCategory = async (req, res) => {
    try {
        const { name, parent, categoryType } = req.body;
        if (!name) return responses.badRequest(res, `Bad request add the category name to add`);
        if (parent) {
            const parentCategory = await Category.findById(parent);
            if (!parentCategory) return responses.notFound(res, `Main Category of ${parent} Id Not Found`);
            const subCategory = await Category.create({ name, parent, categoryType });
            return responses.created(res, `${name} Sub CAtegory Created `, { subCategory })
        }
        const category = (await Category.create({ name, categoryType }));
        return responses.created(res, `${name} Main Category Created `, { category })
    } catch (error) {
        responses.serverError(res, error)
    }
}
// get the main category by id > with sub category name 
//router.route('/api/v1/ecommerce/categories/') 
exports.getCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        if (!categoryId) return responses.badRequest(res, 'Bad Request Add The Id To Get The Category ');
        const category = await Category.findById(categoryId).populate('parent' , 'id name');
        if(!category) return responses.notFound(res , 'Category Not Found');
        responses.ok(res, ` ${category.name}`, {category})
    } catch (error) {
        responses.serverError(res, error);
    }
};

// update name , parent
exports.updateCategry = async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedCategory) return responses.notFound(res, `Category with ID ${req.params.id} not found`);
        responses.ok(res, `${req.params.id} updated`, { updatedCategory });
    } catch (error) {
        responses.serverError(res, error);
    }
}



// delete 
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id)
        if (!category) return responses.notFound(res, `Category with ID ${req.params.id} not found`);
        responses.ok(res, `The Category Deleted`, {});

    } catch (error) {
        responses.serverError(res, error);

    }
}
