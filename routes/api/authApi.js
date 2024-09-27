const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/userContoller')

router.post('/auth/register', UserController.Register);
router.get('/auth/verify-otp/:user_id/:token', UserController.VerifyToken);

module.exports = router;