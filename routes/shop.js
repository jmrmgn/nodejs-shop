const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

// GET => /
router.get('/', shopController.getIndex);

// GET => /products
router.get('/products', shopController.getProducts);

// GET => /product/<productId>
router.get('/products/:productId', shopController.getProduct);

// GET => /cart
router.get('/cart', shopController.getCart);

// POST => /cart 'adding product to the cart'
router.post('/cart', shopController.postCart);

// POST => /cart-delete-item
router.post('/cart-delete-item', shopController.postCartDeleteProduct);

// // POST => /create-order
// router.post('/create-order', shopController.postOrder);

// // // GET => /cart
// router.get('/orders', shopController.getOrders);

module.exports = router;