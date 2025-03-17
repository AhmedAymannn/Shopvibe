const Category = require('../models/category');
const imagesHelper = require('../utils/imagesHelper');
const fs = require('fs');
const path = require('path');

exports.createCategory = async (body, file) => {
    const { name, parent, categoryType } = body;
    const categoryImage = await imagesHelper.uploadSingleImage(file, 'category');
    if (!name || !file) throw new Error(`Bad request add the category name and category image to add`);
    if (parent) {
        const parentCategory = await Category.findById(parent);
        if (!parentCategory) throw new Error(`Main Category of ${parent} Id Not Found`);
        return await Category.create({name, parent, categoryType, image: categoryImage});
    }
    return await Category.create({ name, categoryType, image: categoryImage });
}

exports.getCategories = async () => {
    const categories = await Category.find().populate('parent', '_id name');
    if (!categories) throw new Error(`Category Not Found`);
    return categories;
}

exports.getCategory = async (categoryId) => {
    const category = await Category.findById(categoryId).populate('parent', '_id name');
    if (!category) throw new Error(`Category with ID ${categoryId} Not Found`);
    return category;
}

exports.updateCategryBody = async (categoryId, body) => {
    const { name, parent, categoryType } = body;
    const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        {name,parent,categoryType}, 
        { new: true, runValidators: true });
    if (!updatedCategory)  throw new Error(`Category Not Found`);
    return updatedCategory ;
}

exports.deleteCategory = async (categoryId) => {
    const category = await Category.findById(categoryId);
    if(!category) throw new Error(`Category Not Found`);
    const imageUrl = category.image ;
    const isDeleted = await imagesHelper.deleteSingleImage('categories' ,imageUrl);
    await category.deleteOne() ;
    return isDeleted;
}

exports.updateCategoryImage = async (categoryId , file ) => {
    if(!file || !categoryId) throw new Error ('File And CategoryId Is Required');
    const category = await Category.findById(categoryId);
    if (!category) throw new Error(`Category with ID ${categoryId} not found`);
    try {
        const oldImageUrl = category.image;
        const newImageUrl = await imagesHelper.updateSingleImage(file , 'categories',oldImageUrl);
        category.image = newImageUrl ;
        await category.save();
        return category;
    } catch (error) {
        throw new Error(`Failed to update category image: ${error.message}`);
    }
}
