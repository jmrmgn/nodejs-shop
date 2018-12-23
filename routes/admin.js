const express = require('express');

const adminController = require('../controllers/admin');
const auth = require('../middleware/is-auth');
const { body } = require('express-validator/check');

const router = express.Router();

// GET => /admin/add-product
router.get('/add-product', auth.notLoggedIn, adminController.getAddProduct);

// GET => /admin/products
router.get('/products', auth.notLoggedIn, adminController.getProducts);

// POST => /admin/add-product
router.post('/add-product',
   [
      body('title', 'Title must be minimum of 3 characters')
         .isString()
         .isLength({min:3})
         .trim(),
      body('price', 'Price has invalid value').isFloat(),
      body('description', 'Description must have minimum of 5 and maximum of 500 characters')
         .isLength({ min: 5, max: 500 })
         .trim()
   ],
   auth.notLoggedIn, adminController.postAddProduct);

// GET => /admin/edit-product/:productId
router.get('/edit-product/:productId', auth.notLoggedIn, adminController.getEditProduct);

// POST => /admin/edit-product
router.post('/edit-product',
   [
      body('title', 'Title must be minimum of 3 characters')
         .isString()
         .isLength({min:3})
         .trim(),
      body('price', 'Price has invalid value').isFloat(),
      body('description', 'Description must have minimum of 5 and maximum of 500 characters')
         .isLength({ min: 5, max: 500 })
         .trim()
   ],
   auth.notLoggedIn, adminController.postEditProduct);

// POST => /admin/delete-product
router.delete('/product/:productId', auth.notLoggedIn, adminController.deleteProduct);

module.exports = router;