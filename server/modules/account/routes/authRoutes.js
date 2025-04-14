
// healthcare-support-project/server/modules/account/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');


router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp-forgot', authController.verifyOTPForgot);
router.post('/reset-password', authController.resetPassword);

router.get('/permissions/:role', authController.getPermissionsByRole);
router.get('/permissions/all-roles', authController.getAllRolePermissions);
router.get('/users', authController.getUsers);
router.post('/users', authController.addUser);
router.put('/users/:id', authController.updateUser);
router.delete('/users/:id', authController.deleteUser);

router.get('/user/:id', authenticateToken, authController.getUserById);

router.use((req, res) => {
  console.error(`Route không tồn tại: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: `Route không tồn tại: ${req.method} ${req.originalUrl}` });
});

module.exports = router;