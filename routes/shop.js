const express = require('express');

const shopController = require('../controllers/shop');
const auth = require('../middleware/is-auth');

const router = express.Router();

// GET => /
router.get('/', shopController.getIndex);

// GET => /products
router.get('/products', shopController.getProducts);

// GET => /product/<productId>
router.get('/products/:productId', shopController.getProduct);

// GET => /cart
router.get('/cart', auth.notLoggedIn, shopController.getCart);

// POST => /cart 'adding product to the cart'
router.post('/cart', auth.notLoggedIn, shopController.postCart);

// POST => /cart-delete-item
router.post('/cart-delete-item', auth.notLoggedIn, shopController.postCartDeleteProduct);

// POST => /create-order
router.post('/create-order', auth.notLoggedIn, shopController.postOrder);

// GET => /cart
router.get('/orders', auth.notLoggedIn, shopController.getOrders);

module.exports = router;