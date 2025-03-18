const User = require('../models/user');
const responses = require('../utils/responses');
const userService = require('../services/userService');
const { response } = require('express');
exports.getMe = async (req, res) => {
    try {
        const userId = req.user?.id;
        const user = await userService.getMe(userId);
        responses.ok(res , `${user.name} Profile` , {user});
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};
// admins only 
exports.getUsers = async(req,res)=>{
try {
    const users = await userService.getUsers();
    if (!users) return responses.notFound(res , `Users not found`);
    responses.ok(res , `users` , {Result:users.length, users});
} catch (error) {
    responses.serverError(res , error)
}
// admins only 
}
exports.getUser = async (req,res)=>{
try {
    if(!req.params.id) return responses.badRequest(res , `User Id Is Required`);
    const user = await userService.getUserById(req.params.id);
    if (!user) return responses.notFound(res , `User not found`);
    responses.ok(res , `user data` , {user});
} catch (error) {
    responses.serverError(res , error)
}
}

exports.updateMe = async (req,res)=>{
try {
    const userId = req.user?.id;
    if(!userId) return responses.unAuthorized(res , `Unauthorized`) ;
    const updatedUser = await userService.updateMe(userId , req.body)
    responses.ok(res , `user updated` , {updatedUser})
} catch (error) {
    responses.serverError(res , error)
}
}

exports.deleteMe = async (req,res)=>{
try {
    
    const userId = req.user.id;
    const user = await userService.deleteMe(userId);
    if (!user) return responses.notFound(res , `User not found`);
    user.active = false ;
    await user.save();
    responses.ok(res , `User Deleted ` , {});
} catch (error) {
    responses.serverError(res , error)
}
}
exports.updateProfileImage = async (req, res)=>{
try {
    const userId = req.user?.id;
    if(!req.file || !userId) return responses.badRequest(res , `file is required`);
    const updatedUser = await userService.updateProfileImage(req.params.id , req.file);
    response.ok(res ,`${updatedUser.name} Profile Image Updated ` , {updatedUser});
} catch (error) {
    responses.serverError(res , error)

}
}

