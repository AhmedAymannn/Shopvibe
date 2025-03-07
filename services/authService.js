const Blacklist = require('../models/blackList');
const User = require('../models/user');
const crypto = require('crypto');
const jwtHelper = require('../utils/jwt');
const sendEmail = require('../utils/email');

exports.signUp = async (body) => {
    const { email, name, password, phone, address } = body;
    const user = await User.create({
        email,
        name,
        password,
        phone,
        address,
        role: "customer"
    });
    if (!user) throw new Error('User creation failed');
    const token = jwtHelper.creatJwt(user.id);
    await sendEmail({
        email: user.email,
        subject: 'Welcome to our Ecommerce app',
        message: `Dear ${user.name},
        Thank you for signing up with [Your Store Name]! We're excited to have you on board.
        You can now explore our wide range of products and enjoy a seamless shopping experience.
        If you have any questions or need assistance, feel free to contact our support team.
        Best regards`
    }).catch((err) => console.error("Error sending email:", err));
    return { token, user };
};

exports.login = async (body) => {
    const { email, password } = body;
    if (!email || !password) throw new Error('Email and password are required.');
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        throw new Error('Incorrect email or password.');
    }
    if (!user.active) throw new Error('User has deactivated their account.');
    const token = jwtHelper.creatJwt(user._id);
    return { token, user };
}

exports.forgotPassword = async (body) => {
    const { email } = body;
    if (!email) throw new Error('Enter your email');

    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const resetToken = await user.createResetToken();
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.passwordResetToken = hashedToken;
    await user.save({ runValidators: false });

    const url = `http://localhost:3000/api/v1/ecommerce/resetpassword/${resetToken}`;

    await sendEmail({
        email,
        subject: 'Forgot Password',
        message: `Open ${url} to reset your password`,
    });

    return { message: 'Password reset link sent' };
};

exports.resetPassword = async (token, newPassword) => {
    if (!token) throw new Error('Token is required');

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) throw new Error('Invalid or expired reset token');

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();

    const newToken = jwtHelper.creatJwt(user._id);
    return { message: 'Password reset successful', token: newToken };
};

exports.logOut = async (token) => {
    const isAdded = await exports.addToBlackList(token);
    if (!isAdded) throw new Error('Failed to blacklist token');
};

exports.addToBlackList = async (token) => {
    const addedToken = await Blacklist.create({ token });
    if (!addedToken) throw new Error('Failed to add token to blacklist');
    return true;
};
