const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const responses = require('../utils/responses')

exports.protectWithHeaders = async (req, res, next) => {
    try {
        // 1: Extract the token from headers (Bearer <token>)
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return responses.unAuthorized(res, 'Unauthorized: Login first');
        }
        // 2: Verify the token
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // 3: Ensure the user exists and fetch full data
        const user = await User.findById(decode.id).select('-password');
        if (!user) {
            return responses.notFound(res, 'User no longer exists');
        }
        // 4: Check if password was changed after token was issued
        if (user.passwordChangedAt) {
            const passwordChangedTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
            if (decode.iat < passwordChangedTimestamp) {
                return responses.unAuthorized(res, 'Password recently changed. Please log in again');
            }
        }
        // 5: Attach user data to request
        req.user = user;
        // 6: Call next middleware
        next();
    } catch (error) {
        responses.unAuthorized(res, 'Invalid or expired token');
    }
};


exports.protectWithCookie = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt; // Returns undefined if req.cookies doesn't exist
        if (!token) {
            return res.status(401).json({
                status: 'failed',
                message: ' Unauthorized: No token provided'
            })
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decode.id).select('-password');
        if (!user) {
            return res.status(404).json({
                status: 'failed',
                message: ' User no longer exist'
            })
        }
        // 4: attach the user for the req.user
        req.user = user;
        //5 : call the next middleware
        next();
    } catch (error) {
        res.status(401).json({
            status: 'failed',
            message: 'Invalid or expired token'
        });
    }
}

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        try {
            const userRole = req.user?.role;
            if (!roles.includes(userRole)) {
                return res.status(401).json({
                    message: 'not authorizated'
                })
            }
            next();
        } catch (error) {
            res.status(401).json({
                status: 'failed',
                message: 'Invalid or expired token'
            });
        }
    }

}