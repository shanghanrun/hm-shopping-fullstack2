const express = require('express')
const userRouter = express.Router()
const userController =require('../controller/userController')
const authController =require('../controller/authController')

userRouter.post('/', userController.createUser)
userRouter.post('/login', userController.loginWithEmail)
userRouter.post('/google', userController.loginWithGoogle)
userRouter.get('/me', authController.authenticate, userController.getUser) // 토큰이 valid한지 검증, token으로 유저를 찾아서 리턴

module.exports =userRouter