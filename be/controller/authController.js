const firebaseApp = require('../app')
// 파이어베이스 디비
const admin = firebaseApp.admin;
const db = admin.firestore();
const usersCollection = db.collection('users');


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
		const userDoc = await usersCollection.doc(userId).get();
		const user = userDoc.data()
		if(!user || user.level !== 'admin') throw new Error('no permission')
		next()
	}catch(e){
		res.status(400).json({status:'fail', error:e.message})
	}
}
module.exports = authController;