const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const auth = require('../middleware/is-auth');

const router = express.Router();

// GET => /admin/add-product
router.get('/add-product', auth.notLoggedIn, adminController.getAddProduct);

// GET => /admin/products
router.get('/products', auth.notLoggedIn, adminController.getProducts);

// POST => /admin/add-product
router.post('/add-product', auth.notLoggedIn, adminController.postAddProduct);

// GET => /admin/edit-product/:productId
router.get('/edit-product/:productId', auth.notLoggedIn, adminController.getEditProduct);

// POST => /admin/edit-product
router.post('/edit-product', auth.notLoggedIn, adminController.postEditProduct);

// POST => /admin/delete-product
router.post('/delete-product', auth.notLoggedIn, adminController.postDeleteProduct);

module.exports = router;