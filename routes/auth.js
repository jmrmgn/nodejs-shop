const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const auth = require('../middleware/is-auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', auth.loggedIn, authController.getLogin);

router.post('/login', auth.loggedIn, authController.postLogin);

router.get('/signup', auth.loggedIn, authController.getSignup);

router.post(
   '/signup',
   auth.loggedIn,
   [
      check('email')
         .isEmail()
         .withMessage('Please enter a valid email')
         .custom((value, {req}) => {
            return User
               .findOne({ email: value})
               .then(userDoc => {
                  if (userDoc) {
                     return Promise.reject('Email already exists');
                  }
               });
         }),
      body('password', 'Password must contain minimum of 5 characters and Alphanumeric')
         .isLength({ min: 5 })
         .isAlphanumeric(),
      body('confirmPassword')
         .custom( (value, { req }) => {
            if ( value !== req.body.password ) {
               throw new Error(`Passwords doesn't match`);
            }
            return true;
         })
   ],
   authController.postSignup
);

router.post('/logout', auth.notLoggedIn, authController.postLogout);

router.get('/reset', auth.loggedIn, authController.getReset);

router.post('/reset', auth.loggedIn, authController.postReset);

router.get('/reset/:token', auth.loggedIn, authController.getNewPassword);

router.post('/new-password', auth.loggedIn, authController.postNewPassword);

module.exports = router;