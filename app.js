const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database');

const app = express();

const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

// Setting up EJS template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Getting the form within the body
app.use(bodyParser.urlencoded({extended: false}));

//for static middleware(images,, .css, .js )
app.use(express.static(path.join(__dirname, 'public'))); 

app.use( (req, res, next) => {
   // User.findById(1)
   //    .then(user => {
   //       req.user = user;
   //       next();
   //    })
   //    .catch(err => console.log(err));
})

// Routes
app.use('/admin', adminRoutes);
// app.use(shopRoutes);

// Displaying 404 page
app.use(errorController.get404);

mongoConnect(() => {
   app.listen(3000);
})