
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

exports.creatJwt = (userId) =>{
    const token = jwt.sign({ id: userId } , process.env.JWT_SECRET_KEY ,{ expiresIn: '7d' }) ;
    return token ; 
}

exports.sendToken = (token , statusCode , res)=>{
    res.status(statusCode).json({
        status : 'success',
        Data : token      
    })
}

exports.sendTokenCookie = (token , statusCode , res)=>{
    res.cookie('jwt',token,{
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),//1 day
        httpOnly: true,// Prevent client-side JavaScript access
        // secure: true => when using https
    });
}
