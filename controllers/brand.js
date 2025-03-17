const brandService = require('../services/brandService');
const responses = require('../utils/responses');

exports.getBrands = async (req, res) => {
    try {
        const brands = await brandService.getBrands();
        responses.ok(res, 'Brands ', {Result : brands.length, brands });
    } catch (error) {
        responses.serverError(res, error);
    }
};

exports.getBrand = async (req, res) => {
    try {
        const brand = await brandService.getBrand(req.params.id);
        responses.ok(res, 'Brand retrieved successfully', { brand });
    } catch (error) {
        responses.serverError(res, error);
    }
};

exports.addBrand = async (req, res) => {
    try {
        const brand = await brandService.createBrand(req.body, req.file);
        responses.ok(res, 'Brand created successfully', { brand });
    } catch (error) {
        responses.serverError(res, error);
    }
};

exports.updateBrandBody = async (req, res) => {
    try {
        console.log(`inside controller`);

        const updatedBrand = await brandService.updateBrandBody(req.params.id, req.body);
        responses.ok(res, 'Brand updated successfully', { updatedBrand });
    } catch (error) {
        responses.serverError(res, error);
    }
};

exports.updateBrandImage = async (req, res) => {
    try {
        console.log(`inside controller`);
        
        const updatedBrand = await brandService.updateBrandImage(req.params.id, req.file);
        responses.ok(res, 'Brand image updated successfully', { updatedBrand });
    } catch (error) {
        responses.serverError(res, error);
    }
};

exports.deleteBrand = async (req, res) => {
    try {
        await brandService.deleteBrand(req.params.id);
        responses.ok(res, 'Brand deleted successfully', {});
    } catch (error) {
        responses.serverError(res, error);
    }
};
