const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

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
   User.findById(1)
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

// Creating the relation/ association
Product.belongsTo(User, {
   constraints: true,
   onDelete: 'CASCADE'
});
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// Check all the models that are define in 'MODELS' folder and syncs to the database
sequelize
   // .sync({force: true}) // NOTE: sync({ force: true}) is not use for PRODUCTION, it is forcing to ALTER tables
   .sync()
   .then(result => {
      return User.findById(1);    
   })
   .then(user => {
      if (!user) {
         return User.create({ name: 'Jomar', email: 'jomar@gmail.com' })
      }
      return user;
   })
   // .then(user => {
   //    return user.createCart();
   //    // Server listens
   // })
   .then(result => {
      app.listen(3000);
   })
   .catch(err => console.log(err));

   
