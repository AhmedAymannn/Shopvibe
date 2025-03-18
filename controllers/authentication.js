const jwtHelper = require('../utils/jwt');
const responses = require('../utils/responses');
const authService = require('../services/authService')
exports.SignUp = async (req, res) => {
    try {
        const { token, user } = await authService.signUp(req.validatedData, res);
        jwtHelper.sendToken(token, 201, res);
    } catch (error) {
        responses.serverError(res, error);
    }
}
exports.login = async (req, res) => {
    try {
        const { token, user } = await authService.login(req.body);
        responses.created(res, 'login successfully ', { token: token, user });
    } catch (error) {
        responses.serverError(res, error);
    }
}
exports.forgotPassword = async (req, res) => {
    try {
        await authService.forgotPassword(req.body);
        responses.ok(res, 'Reset password email sent');
    } catch (error) {
        responses.serverError(res, error);
    }
}
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const result = await authService.resetPassword(token, newPassword);
        jwtHelper.sendToken(result.token, 200, res);
    } catch (error) {
        responses.serverError(res, error);
    }
}
exports.logOut = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        await authService.logOut(token);
        responses.ok(res, 'Logged Out', {});
    } catch (error) {
        responses.serverError(res, error);
    }
}

