const { usersCollection } = require('../firebaseConfig')


const authController ={}
const jwt = require('jsonwebtoken')
require('dotenv').config()
const secretKey = process.env.JWT_SECRET_KEY

authController.authenticate =(req, res, next)=>{
	try{
		const tokenString = req.headers.authorization
		if(!tokenString){
			throw new Error('no token')
		} 
		const token = tokenString.replace("Bearer ",'')
		jwt.verify(token, secretKey, (err, payload)=>{
			if(err){
				throw new Error('invalid token')
			}
			console.log('payload', payload)
			req.userId = payload.id
			console.log('토큰 검증 user Id', payload.id)
		})
		
		console.log('토큰 검증되었음')
		next()
	} catch(e){
		return res.status(400).json({status:'fail', error:e.message})
	}
}

authController.checkAdminPermission =async(req,res,next)=>{
	try{   // authController.authenticate에서 넘어온 userId로 level이 admin인지 확인
		const userId = req.userId
		console.log('userId :', userId)
		const userDoc = await usersCollection.doc(userId).get();
		const user = userDoc.data()
		console.log('userDoc exists:', userDoc.exists);  // 문서 존재 여부 확인
		console.log('Fetched user data:', user); 
		if(!user || user.level !== 'admin') throw new Error('no permission')
		console.log('admin 검증됨')
		next()
	}catch(e){
		res.status(400).json({status:'fail', error:e.message})
	}
}
module.exports = authController;