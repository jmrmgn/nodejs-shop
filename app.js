const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Setting up EJS template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Getting the form within the body
app.use(bodyParser.urlencoded({extended: false}));

//for static middleware(images,, .css, .js )
app.use(express.static(path.join(__dirname, 'public'))); 

app.use( (req, res, next) => {
   User.findById('5c18aba8185dbd3950b84a76')
      .then(user => {
         req.user = user;
         next();
      })
      .catch(err => console.log(err));
})

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Displaying 404 page
app.use(errorController.get404);

mongoose
   .connect(
      'mongodb+srv://jomar26:EYqtc4E8tFqcDmin@cluster0-jfpaj.mongodb.net/shop?retryWrites=true',
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
   })
   .catch(err => console.log(`Connection error: ${err}`));