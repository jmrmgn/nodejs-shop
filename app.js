const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars'); // handlebars

const app = express();

// setting the template engine for PUG
app.engine('hbs', expressHbs({
   layoutsDir: 'views/layouts/',
   defaultLayout: 'main-layout',
   extname: 'hbs'
}));
app.set('view engine', 'hbs');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Getting the form within the body
app.use(bodyParser.urlencoded({extended: false}));

//for static middleware(images,, .css, .js )
app.use(express.static(path.join(__dirname, 'public'))); 

// Routes
app.use('/admin', adminData.routes);
app.use(shopRoutes);

// Displaying 404 page
app.use((req, res, next) => {
   // res.status(404).sendFile(
   //    path.join(__dirname, 'views', '404.html')
   // );
   res.status(404).render('404', {
      title: 'Page not Found'
   });
});

// Server listens
app.listen(3000);