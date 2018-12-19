const User = require('../models/user');

exports.getLogin = (req, res, next) => {
   // const isLoggedIn = req
   //    .get('Cookie')
   //    .split(';')[3]
   //    .trim()
   //    .split('=')[1];
   console.log(req.session);
   res.render('auth/login', {
      title: 'Login',
      path: '/login',
      isAuthenticated: req.session.isLoggedIn
   });
};

exports.postLogin = (req, res, next) => {
   User
      .findById('5c199c1b3a1e9733d4324f2f')
      .then(user => {
         req.session.isLoggedIn = true;
         req.session.user = user;
         req.session.save(err => {
            console.log(err);
            res.redirect('/');
         })
      })
      .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
   req.session.destroy(err => {
      console.log(err);
      res.redirect('/');
   });
}