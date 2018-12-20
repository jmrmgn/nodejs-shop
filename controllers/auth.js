const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
   auth: {
      api_key: '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'
   }
}));

exports.getLogin = (req, res, next) => {
   let message = req.flash('error');
   if ( message.length > 0 ) {
      message = message[0];
   }
   else {
      message = null;
   }
   console.log(req.session);
   res.render('auth/login', {
      title: 'Login',
      path: '/login',
      errorMessage: message
   });
};

exports.postLogin = (req, res, next) => {
   const email = req.body.email;
   const password = req.body.password;

   User
      .findOne({ email: email })
      .then(user => {
         if ( !user ) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
         }
         bcrypt
            .compare(password, user.password)
            .then(doMatch => {
               if (doMatch) {
                  req.session.isLoggedIn = true;
                  req.session.user = user;
                  return req.session.save(err => {
                     res.redirect('/');
                  })
               }
               else {
                  req.flash('error', 'Invalid email or password.');
                  res.redirect('/login');
               }
            })
            .catch(err => {
               req.flash('error', 'Invalid email or password.');
               res.redirect('/login');
            })
      })
      .catch(err => console.log(err));
}

exports.getSignup = (req, res, next) => {
   let message = req.flash('error');
   if ( message.length > 0 ) {
      message = message[0];
   }
   else {
      message = null;
   }
   res.render('auth/signup', {
      title: 'Sign up',
      path: '/signup',
      errorMessage: message
   })
};

exports.postSignup = (req, res, next) => {
   const email = req.body.email;
   const password = req.body.password;
   const confirmPassword = req.body.confirmPassword;

   User
      .findOne({ email: email})
      .then(userDoc => {
         if (userDoc) {
            req.flash('error', 'Email already exists.');
            return res.redirect('/signup');
         }
         return bcrypt
            .hash(password, 12)
            .then(hashedPassword => {
               const user = new User({
                  email: email,
                  password: hashedPassword,
                  cart: { items: [] }
               })
               return user.save();
            })
            .then(result => {
               res.redirect('/login');
               return transporter.sendMail({
                  to: email,
                  from: 'shop@node-complete.com',
                  subject: 'Signup succeeded!',
                  html: '<h1>Welcome to Node shop!, Enjoy shopping</h1>'
               });
            })
            .catch(err => console.log(err))
      })
      .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
   req.session.destroy(err => {
      console.log(err);
      res.redirect('/');
   });
};

exports.getReset = (req, res, next) => {
   let message = req.flash('error');
   if ( message.length > 0 ) {
      message = message[0];
   }
   else {
      message = null;
   }
   res.render('auth/reset', {
      title: 'Reset password',
      path: '/reset',
      errorMessage: message
   });
};

exports.postReset = (req, res, next) => {
   crypto.randomBytes(32, (err, buffer) => {
      if ( err ) {
         console.log(err);
         return res.redirect('/reset');
      }
      
      const token = buffer.toString('hex');
      User
         .findOne({ email: req.body.email })
         .then(user => {
            if ( user ) {
               res.redirect('/');
               transporter.sendMail({
                  to: req.body.email,
                  from: 'shop@node-complete.com',
                  subject: 'Password reset',
                  html: `
                     <p>You requested a password reset</p>
                     <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
                  `
               });
               user.resetToken = token;
               user.resetTokenExpiration = Date.now() + 3600000;
               return user.save();
            }
            else {
               req.flash('error', 'No account with that email found!');
               return res.redirect('/reset');
            }
         })
         .catch(err => console.log(err));
   });
}

exports.getNewPassword = (req, res, next) => {
   const token = req.params.token;
   User
      .findOne({resetToken: token, resetTokenExpiration: { $gt: Date.now() }})
      .then(user => {
         let message = req.flash('error');
         if ( message.length > 0 ) {
            message = message[0];
         }
         else {
            message = null;
         }
         if ( user ) {
            res.render('auth/new-password', {
               title: 'New password',
               path: '/new-password',
               errorMessage: message,
               userId: user._id.toString(),
               passwordToken: token
            });
         }
         else {
            req.flash('error', 'Invalid or expired token given');
            res.redirect('/reset');
         }
      })
      .catch(err => console.log(err));
}

exports.postNewPassword = (req, res, next) => {
   const newPassword = req.body.password;
   const userId = req.body.userId;
   const passwordToken = req.body.passwordToken;
   let resetUser;
   
   User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId
   })
   .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
   })
   .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
   })
   .then(result => {
      res.redirect('/login');
      transporter.sendMail({
         to: resetUser.email,
         from: 'shop@node-complete.com',
         subject: 'Reset password succeeded!',
         html: `
            <p>Are you aware that your password was reset last ${Date.now()}?</p>
            <p>If it's not you, please log in your account immediately.</p>
         `
      });
   })
   .catch(err => console.log(err));

};