const express = require('express')
const router = express.Router();
const userController = require('../controllers/user');
const authController = require('../controllers/authentication')
const authMiddleware = require('../middleware/authMiddleware')
//get all users 
router.route('/')
    .get(authMiddleware.protectWithHeaders,
        authMiddleware.restrictTo('admin'),
        userController.getUsers)
// get user with my jwt => get my profile only  
router.route('/me')
    .get(authMiddleware.protectWithHeaders , userController.getMe)
    .patch(authMiddleware.protectWithHeaders, userController.updateMe)
    .delete(authMiddleware.protectWithHeaders, userController.deleteMe)
// get user with the id , for admins 
router.route('/:id')
    .get(authMiddleware.protectWithHeaders,
        authMiddleware.restrictTo('admin'),
        userController.getUser)
router.route('/signUp')
    .post(authController.SignUp)
router.route('/login')
    .post(authController.login);
router.route('/logout')
    .post(authMiddleware.protectWithHeaders,authController.logOut);
router.route('/forgotPassword')
    .post(authController.forgotPassword);
router.route('/resetPassword/:token')
    .patch(authController.resetPassword);
// router.patch('/updateProfileImage/:id' ,
//     upload('users').single('user-profile') , 
//     userController.updateProfileImage)


module.exports = router;