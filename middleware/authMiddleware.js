const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Blacklist = require('../models/blackList');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const responses = require('../utils/responses')

exports.protectWithHeaders = async (req, res, next) => {
    try {
        // 1. Extract token
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            throw new Error('Unauthorized: Login first');
        }
        const token = req.headers.authorization.split(' ')[1];

        // 2. Verify token first (avoiding unnecessary DB query)
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // 3. Check if token is blacklisted
        const isBlacklisted = await Blacklist.exists({ token });
        if (isBlacklisted) throw new Error('Token has been blacklisted.');

        // 4. Ensure the user exists
        const user = await User.findById(decode.id).select('-password');
        if (!user) throw new Error('User no longer exists');

        // 5. Check if password was changed after token was issued
        if (user.passwordChangedAt) {
            const passwordChangedTimestamp = Math.floor(user.passwordChangedAt.getTime() / 1000);
            if (decode.iat < passwordChangedTimestamp) {
                throw new Error('Password recently changed. Please log in again');
            }
        }
        // 6. Attach user data to request
        req.user = user;
        // 7. Call next middleware
        next();
    } catch (error) {
        return responses.unAuthorized(res, error.message);
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
        
        // 3. Check if token is blacklisted
        const isBlacklisted = await Blacklist.exists({ token });
        if (isBlacklisted) throw new Error('Token has been blacklisted.');
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