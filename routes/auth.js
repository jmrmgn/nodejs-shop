const express = require('express');

const authController = require('../controllers/auth');
const auth = require('../middleware/is-auth');

const router = express.Router();

router.get('/login', auth.loggedIn, authController.getLogin);

router.post('/login', auth.loggedIn, authController.postLogin);

router.get('/signup', auth.loggedIn, authController.getSignup);

router.post('/signup', auth.loggedIn, authController.postSignup);

router.post('/logout', auth.notLoggedIn, authController.postLogout);

module.exports = router;