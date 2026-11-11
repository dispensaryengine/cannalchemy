
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const authController = require('../controllers/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/guest', authController.guestLogin);
router.post('/logout', authController.logout);
router.get('/me', auth, authController.getMe);

module.exports = router;
