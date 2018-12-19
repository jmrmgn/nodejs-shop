const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb://admin:test1234@ds139459.mlab.com:39459/shop';

const app = express();
const store = new MongoDBStore({
   uri: MONGODB_URI,
   collection: 'sessions'
}); 

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

app.use( (req, res, next) => {
   if ( !req.session.user) {
      return next();
   }
   User.findById(req.session.user._id)
      .then(user => {
         req.user = user;
         next();
      })
      .catch(err => console.log(err));
})

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// Displaying 404 page
app.use(errorController.get404);

mongoose
   .connect(
      // 'mongodb+srv://jomar26:EYqtc4E8tFqcDmin@cluster0-jfpaj.mongodb.net/shop?retryWrites=true', Mongo Atlas
      MONGODB_URI,
      {
         useNewUrlParser: true
      }
   )
   .then(result => {
      User
         .findOne()
         .then(user => {
            if ( !user ) {
               const user = new User({
                  name: "Jomar",
                  email: "test@gmail.com",
                  cart: {
                     items: []
                  }
               });
               user.save();
            }
         });
      app.listen(3000);
      console.log("Connected");
   })
   .catch(err => console.log(`Connection error: ${err}`));