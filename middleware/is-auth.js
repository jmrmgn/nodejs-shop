exports.notLoggedIn = (req, res, next) => {
   if ( !req.session.isLoggedIn ) {
      return res.redirect('/login');
   }
   next();
}

exports.loggedIn = (req, res, next) => {
   if ( req.session.isLoggedIn ) {
      return res.redirect('/');
   }
   next();
}