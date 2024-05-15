const express = require('express')
const router = express.Router()
const orderController =require('../controller/orderController')
const authController = require('../controller/authController')

router.post('/', authController.authenticate, orderController.createOrder)
router.post('/', authController.authenticate, orderController.createOrder)
router.get('/', authController.authenticate, orderController.getOrderList)
router.put('/', authController.authenticate, authController.checkAdminPermission, orderController.updateOrder)

module.exports =router