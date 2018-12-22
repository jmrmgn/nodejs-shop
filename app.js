const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

// FOR MONGODB ATLAS
// const MONGODB_URI = 'mongodb+srv://jomar26:EYqtc4E8tFqcDmin@cluster0-jfpaj.mongodb.net/shop?retryWrites=true'

// FOR CLOUD DATABASE
// const MONGODB_URI = 'mongodb://admin:test1234@ds139459.mlab.com:39459/shop';

// FOR LOCAL DATABASE
const MONGODB_URI = 'mongodb://localhost/db-shop';

const app = express();
const store = new MongoDBStore({
   uri: MONGODB_URI,
   collection: 'sessions'
}); 

const csrfProtection = csrf();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// Setting up EJS template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Getting the form within the body
app.use(bodyParser.urlencoded({extended: false}));

//for static middleware(images,, .css, .js )
app.use(express.static(path.join(__dirname, 'public'))); 

// SEssion middleware
app.use(session({
   secret: 'my secret',
   resave: false,
   saveUninitialized: false,
   store: store
}))

app.use(csrfProtection);
app.use(flash());

app.use( (req, res, next) => {
   if ( !req.session.user) {
      return next();
   }
   User.findById(req.session.user._id)
      .then(user => {
         if (!user) {
            return next();
         }
         req.user = user;
         next();
      })
      .catch(err => {
         throw new Error(err);
      });
})

app.use((req, res, next) => {
   res.locals.isAuthenticated = req.session.isLoggedIn;
   res.locals.csrfToken = req.csrfToken();
   next();
});

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// Displaying 500 page
app.get('/500', errorController.get500);

// Displaying 404 page
app.use(errorController.get404);

app.use((error, req, res, next) => {
   res.redirect('/500');
})

mongoose
   .connect(
      MONGODB_URI,
      {
         useNewUrlParser: true
      }
   )
   .then(result => {
      app.listen(3000);
      console.log("Connected");
   })
   .catch(err => console.log(`Connection error: ${err}`));