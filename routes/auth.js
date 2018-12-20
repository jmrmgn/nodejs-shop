const express = require('express');

const authController = require('../controllers/auth');
const auth = require('../middleware/is-auth');

const router = express.Router();

router.get('/login', auth.loggedIn, authController.getLogin);

router.post('/login', auth.loggedIn, authController.postLogin);

router.get('/signup', auth.loggedIn, authController.getSignup);

router.post('/signup', auth.loggedIn, authController.postSignup);

router.post('/logout', auth.notLoggedIn, authController.postLogout);

router.get('/reset', auth.loggedIn, authController.getReset);

router.post('/reset', auth.loggedIn, authController.postReset);

router.get('/reset/:token', auth.loggedIn, authController.getNewPassword);

router.post('/new-password', auth.loggedIn, authController.postNewPassword);

module.exports = router;