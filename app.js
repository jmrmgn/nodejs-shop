const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
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
   User.findById('5c13c5f8ceb40c1d0cef25e8')
      .then(user => {
         req.user = new User(user.name, user.email, user.cart, user._id);
         next();
      })
      .catch(err => console.log(err));
})

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Displaying 404 page
app.use(errorController.get404);

mongoConnect(() => {
   app.listen(3000);
})