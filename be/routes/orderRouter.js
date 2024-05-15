const express = require('express')
const router = express.Router()
const orderController =require('../controller/orderController')
const authController = require('../controller/authController')

router.post('/', authController.authenticate, orderController.createOrder)
// router.get('/', authController.authenticate, orderController.getOrderList)
router.post('/2', authController.authenticate, orderController.createOrder2)
router.get('/', authController.authenticate, orderController.getOrderList2)
router.put('/2', authController.authenticate, authController.checkAdminPermission, orderController.updateOrder2)

module.exports =router