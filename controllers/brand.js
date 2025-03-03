const brandService = require('../services/brandService');
const responses = require('../utils/responses');

exports.getBrands = async (req,res)=>{
    try {
        await brandService.getBrands(res);
    } catch (error) {
        responses.serverError(res , error)
    }
}
exports.getBrand = async (req,res)=>{
    try {
        await brandService.getBrand(req.params.id , res);
    } catch (error) {
        responses.serverError(res , error)
    }
}
exports.createBrand = async (req,res)=>{
    try {
        await brandService.createBrand(req.body , res);
    } catch (error) {
        responses.serverError(res , error)
    }
}
exports.UpdateBrand = async (req,res)=>{
    try {
        await brandService.updateBrand(req.body ,req.params.id, res);
    } catch (error) {
        responses.serverError(res , error)
    }
}
exports.DeleteBrand = async (req,res)=>{
    try {
        await brandService.DeleteBrand(req.params.id , res);
    } catch (error) {
        responses.serverError(res , error)
    }
}

