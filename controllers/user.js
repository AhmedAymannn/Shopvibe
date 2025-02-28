const User = require('../models/user');

exports.getMe = async (req,res)=>{
    try {
        //get my profile with req.user.id 
        const userId = req.user.id;
        const user = await User.findById(userId).select('-_id -password -createdAt -updatedAt -passwordChangedAt -__v');
        if(!user){  
            return res.status(200).json({
                status : 'faild',
                message : 'user not found'
            })
        }
        res.status(200).json({
            status : 'success',
            Data : {
                user
            }
        })
    } catch (error) {
            res.status(500).json({
            message: error.message
            })
    }
}
// admins only 
exports.getUsers = async(req,res)=>{
try {
    const users = await User.find();
    if(!users){
        return res.status(404).json({
            message : 'collection not found'
        })
    }
    res.status(200).json({
        status : 'success',
        result : users.length ,
        Data : {
            users
        }
    })
} catch (error) {
    res.status(500).json({
        message: error.message
        })
}
// admins only 
}
exports.getUser = async (req,res)=>{
try {
    const user = await User.findById(req.params.id);
    if(!user){
        return res.status(404).json({
            message : 'user not found'
        })
    }
    res.status(200).json({
        status : 'success',
        Data : {
            user
        }
    })
} catch (error) {
        res.status(500).json({
        message: error.message
        })
}

}

exports.updateMe = async (req,res)=>{

    // implement it again with req.user not with id //
try {
    if (!req.user) {
        return res.status(401).json({
            status: 'failed',
            message: 'Unauthorized: Please log in'
        });
    }
    const userId = req.user.id;
    const user = await User.findByIdAndUpdate(
        userId,
        req.body,
        {new : true ,
        runValidators : false
    }
    );
    if(!user){
        return res.status(404).json({
            message : 'user not found'
        })
    }
    res.status(200).json({
        message : 'user updated',
        Data : {
            user
        }
    })
} catch (error) {
    res.status(500).json({
        message: error.message
        })
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
    user.active = false ;
    await user.save();
    res.status(200).json({
        message : 'user deleted',
    })
} catch (error) {
    res.status(500).json({
        message: error.message
        })
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

