const express = require('express')
const router = express.Router()
const cartController =require('../controller/cartController')
const authController =require('../controller/authController')

router.post('/', authController.authenticate, cartController.createCartItem)
router.get('/', authController.authenticate, cartController.getCart)
router.delete('/', authController.authenticate, cartController.emptyCart)
router.post('/:id', authController.authenticate, cartController.deleteCartItem)
router.put('/:id', authController.authenticate, cartController.updateItemQty)


module.exports =router