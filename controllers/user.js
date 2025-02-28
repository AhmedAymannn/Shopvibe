const User = require('../models/user');
const responses = require('../utils/responses');
exports.getMe = async (req,res)=>{
    try {
        //get my profile with req.user.id 
        const userId = req.user.id;
        const user = await User.findById(userId).select('-_id -password -createdAt -updatedAt -passwordChangedAt -__v');
        if(!user) return responses.notFound(res , `user not found`);
        responses.ok(res , `User Data` , {user})
    } catch (error) {
        responses.serverError(res , error)
    }
}
// admins only 
exports.getUsers = async(req,res)=>{
try {
    const users = await User.find();
    if (!users) return responses.notFound(res , `Users not found`);
    responses.ok(res , `users` , {users})
} catch (error) {
    responses.serverError(res , error)
}
// admins only 
}
exports.getUser = async (req,res)=>{
try {
    const user = await User.findById(req.params.id);
    if (!user) return responses.notFound(res , `User not found`);
    responses.ok(res , `user data` , {user});
} catch (error) {
    responses.serverError(res , error)
}

}

exports.updateMe = async (req,res)=>{

    // implement it again with req.user not with id //
try {
    const userId = req.user.id;
    const user = await User.findByIdAndUpdate(
        userId,
        req.body,
        {new : true ,
        runValidators : false
    }
    )
    if (!user) return responses.notFound(res , `User not found`);
    responses.ok(res , `user updated` , {user})
} catch (error) {
    responses.serverError(res , error)
}
}

exports.deleteMe = async (req,res)=>{
try {
    if (!req.user) {
        return res.status(401).json({
            status: 'failed',
            message: 'Unauthorized: Please log in'
        });
    }
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return responses.notFound(res , `User not found`);
    user.active = false ;
    await user.save();
    responses.ok(res , `User Deleted ` , {});
} catch (error) {
    responses.serverError(res , error)
}
}

// exports.updateProfileImage = async (req, res)=>{
// try {
    
// } catch (error) {
//     res.status(500).json({
//         message: error.message
//         })
// }
// }

