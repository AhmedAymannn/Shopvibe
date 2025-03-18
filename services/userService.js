const User = require('../models/user');
const imageHelper = require ('../utils/imagesHelper');

exports.getMe = async (userId) => {
    if (!userId) throw new Error('User ID is required');
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    return user;
};
//admins
exports.getUsers = async () => {
    const users = await User.find();
    if (!users) throw new Error('Users not found');
    return users;
};
exports.getUserById = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    return user;
};
exports.updateMe = async (userId, body) => {
    const allawedFeilds = ['email' , 'name' , 'address' , 'phone'];
    const filterObj = {};
    allawedFeilds.forEach((field)=>{
        if(body[field] !== undefined && body[field] !== ""){
            filterObj[field] = body[field] ;
        }
    })
    if (Object.keys(filterObj).length === 0) {
        throw new Error('No valid fields to update');
    }
    const user = await User.findByIdAndUpdate(userId , filterObj , {runValidators : false , new : true});
    if (!user) throw new Error('User not found');
    return user;
};
exports.deleteMe = async (userId) => {
    const user = await User.findByIdAndUpdate(userId , {active : false} , {runValidators : false});
    if (!user) throw new Error('User not found');
};
exports.updateProfileImage = async (userId , file) =>{
    const user = await User.findById(userId);
    if(!user) throw new Error ('User Not Found');
    const oldImageurl = user.image ; 
    const updatedImage = await imageHelper.updateSingleImage(file , 'users' , oldImageurl);
    user.image = updatedImage ;
    user.save();
    return user
}
