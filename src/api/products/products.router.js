const express = require('express');
const productController = require('./products.controller');
const { validateProduct } = require('../../middlewares/validation.middleware');
const upload = require('../../middlewares/upload.middleware');

const router = express.Router();

// /api/products
router.route('/')
  .post(validateProduct, productController.createProduct)
  .get(productController.getProducts);

// /api/products/:id
router.route('/:id')
  .get(productController.getProductById)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

// /api/products/upload-image
router.post('/upload-image', upload.single('image'), productController.uploadImage);

module.exports = router;
