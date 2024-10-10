const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/userContoller')

router.post('/auth/register', UserController.Register);
router.post('/auth/login', UserController.Login);
router.get('/auth/verify-user/:user_id/:token', UserController.VerifyToken);
router.post('/auth/verify-otp/:id/:otpCode', UserController.verifyOTP);
router.post('/auth/forgetpassword', UserController.forgetpassword);
router.post('/auth/resetpassword/:id/:token', UserController.resetpassword);
router.get('/auth/logout', UserController.Logout);
router.get('/auth/resend-otp/:id', UserController.resendCode);
module.exports = router;