const User = require('../model/User')

const authController ={}
const jwt = require('jsonwebtoken')
require('dotenv').config()
const secretKey = process.env.JWT_SECRET_KEY

authController.authenticate =(req, res, next)=>{
	try{
		const tokenString = req.headers.authorization
		// console.log('tokenString :', tokenString)
		if(!tokenString){
			throw new Error('no token')
		} 
		const token = tokenString.replace("Bearer ",'')
		jwt.verify(token, secretKey, (err, payload)=>{
			if(err){
				throw new Error('invalid token')
			}
			//jwt.verify()를 할 때 payload 객체 {_id, 기타} 를 갖고 실행한다.
			//그래서 검증이 잘되면 payload._id에 id값을 넣어준다.
			// return res.status(200).json({status:'ok', userId:payload._id})
			req.userId = payload._id
		})
		next()
	} catch(e){
		return res.status(400).json({status:'fail', error:e.message})
	}
}

authController.checkAdminPermission =async(req,res,next)=>{
	try{   // authController.authenticate에서 넘어온 userId로 level이 admin인지 확인
		const userId = req.userId
		const user = await User.findById(userId)
		if(user.level !== 'admin') throw new Error('no permission')
		next()
	}catch(e){
		res.status(400).json({status:'fail', error:e.message})
	}
}
module.exports = authController;