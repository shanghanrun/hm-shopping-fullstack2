const express = require('express')
const productRouter = express.Router()
const productController =require('../controller/productController')
const authController =require('../controller/authController')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

productRouter.post('/', authController.authenticate, authController.checkAdminPermission, productController.createProduct)
productRouter.post('/batch', authController.authenticate, authController.checkAdminPermission, upload.single('file'), productController.batchCreateProducts)
productRouter.get('/', productController.getProductList)
productRouter.get('/:id', productController.getProductById)
productRouter.delete('/:id', authController.authenticate, authController.checkAdminPermission, productController.deleteProduct)
productRouter.put('/:id', authController.authenticate, authController.checkAdminPermission, productController.updateProduct)

module.exports =productRouter