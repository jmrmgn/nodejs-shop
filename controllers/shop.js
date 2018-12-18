const Product = require('../models/product');

exports.getProducts = (req, res, next) => {   
   Product.find()
   .then(products => {
      console.log(products);
      res.render('shop/product-list', {
         products: products,
         title: 'All Products',
         path: '/products'
      });
   })
   .catch(err => console.log(err));
}

exports.getProduct = (req, res, next) => {
   const productId = req.params.productId;
   // Product.findAll({
   //    where: { id: prodId}
   // })
   // .then((product) => {
   //    res.render('shop/product-detail', {
   //       product: product[0],
   //       title: product[0].title,
   //       path: '/products'
   //    });
   // })
   // .catch(err => console.log(err, "getProduct ------"));
   Product.findById(productId)
      .then(product => {
         if (!product) {
            return res.redirect('/')
         }
         else {
            res.render('shop/product-detail', {
               product: product,
               title: product.title,
               path: '/products'
            });
         }
      })
      .catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
   Product.find()
   .then(products => {
      res.render('shop/index', {
         products: products,
         title: 'Shop',
         path: '/'
      })
   })
   .catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {
   const prodId = req.body.productId;
   Product
      .findById(prodId)
      .then(product => {
         return req.user.addToCart(product)
      })
      .then(result => {
         console.log(result);
         res.redirect('/cart');
      });
}

exports.postCartDeleteProduct = (req, res, next) => {
   const prodId = req.body.productId;
   req.user
      .deleteItemFromCart(prodId)
      .then(result => {
         res.redirect('/cart');
      })
      .catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
   req.user
      .getCart()
      .then(products => {
         res.render('shop/cart', {
            title: 'Cart',
            path: '/cart',
            products: products
         })
      })
      .catch(err => console.log(err))
}

exports.postOrder = (req, res, next) => {
   let fetchedCart;
   req.user
      .addOrder()
      .then(result =>{
         res.redirect('/orders');
      })
      .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
   req.user
      .getOrders()
      .then(orders => {
         res.render('shop/orders', {
            orders: orders,
            title: 'Orders',
            path: '/orders'
         })
      })
      .catch(err => console.log(err));
   
}

