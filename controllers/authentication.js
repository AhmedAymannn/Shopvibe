const User = require('../models/user');
const Cart = require('../models/cart');
const crypto= require('crypto');
const jwtHelper = require('../utils/jwt');
const responses = require('../utils/responses');
const sendEmail = require('../utils/email');
exports.SignUp = async (req, res) => {
    try {
        const { email, name, password, phone, address } = req.body;
        const user = await User.create({
            email,
            name,
            password,
            phone,
            address,
            role: "customer"
        });
        if (!user) {
            // Bad Request
            return responses.badRequest(res, 'user not created');
        }
        const token = jwtHelper.creatJwt(user.id);
        jwtHelper.sendToken(token, 201, res);
    } catch (error) {
        responses.serverError(res, error);
    }
}
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return responses.badRequest(res, ' email and passwordis required ')
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.correctPassword(password, user.password))) {
            return responses.unAuthorized(res, 'password is not correct')
        }
        if (!user.active) {
            return responses.forbidden(res, 'user has been deactivate the account ')
        }
        const token = jwtHelper.creatJwt(user._id);
        await sendEmail({
            email: user.email,
            subject: 'Login ',
            message: ' go and find your best store '
        }).catch((err) => {
            console.error("Error sending email:", err);
        });
        responses.created(res, 'login successfully ', { token : token , user});
    } catch (error) {
        responses.serverError(res, error);
    }
}
exports.logOut = async (req, res) => {

}
exports.forgotPassword = async (req, res) => {
    // Get the email from user
    const { email } = req.body;
    if (!email) {
        return responses.badRequest(res, 'Enter your email');
    }
    const user = await User.findOne({ email });
    if (!user) {
        return responses.notFound(res, 'User not found');
    }
    const resetToken = await user.createResetToken();
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetToken = hashedToken ;
    await user.save({runValidation : false});
    const url = `http://localhost:3000/api/v1/ecommerce/resetpassword/${resetToken}`;
    await sendEmail({
        email,
        subject: 'Forgot Password',
        message: `Open ${url} to reset your password`,
    });
    responses.ok(res, 'Reset password email sent');
};

exports.resetPassword = async (req, res) => {
    const token = req.params.token;
    if (!token) return responses.forbidden(res, 'Try again');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) return responses.unAuthorized(res, 'Invalid or expired reset token');
    user.password = req.body.newpassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();

    await user.save();
    
    responses.ok(res, { message: 'Password reset successful' });
};