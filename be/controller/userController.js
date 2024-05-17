const { usersCollection } = require('../firebaseConfig')

const bcrypt = require('bcryptjs')
const saltRounds =10
const {OAuth2Client} = require('google-auth-library');

const jwt = require('jsonwebtoken')
require('dotenv').config()
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const secretKey = process.env.JWT_SECRET_KEY

const userController={}

userController.createUser = async(req, res)=>{
	try{
		const {email, password, name, level} = req.body;
		const userSnapshot = await usersCollection.where('email', '==', email).get()
		if(!userSnapshot.empty){ // Snapshot은 배열
			throw new Error('이미 가입된 유저입니다.')
		}

		const hash = bcrypt.hashSync(password, saltRounds)
		const newUser = {
			email,
			password: hash, 
			name, 
			level:level? level :'customer'
		}
		const newUserRef = await usersCollection.add(newUser)
		const userDocId = newUserRef.id // 이것을 사용하는 것은 나중에 알아서 응용
		
		return res.status(200).json({status:'success', data:newUser})
	}catch(e){
		return res.status(400).json({status:'fail', error:e.message})
	}
}


userController.loginWithEmail= async(req, res)=>{
	try{
		const {email,password} = req.body;
		const userSnapshot = await usersCollection.where('email','==', email).get()
		if(userSnapshot.empty){
			// 가입한 상태가 아니라는 메시지, 로그인페이지로 리디렉션
			throw new Error('가입한 상태가 아닙니다. email을 다시 확인해 주세요')
		} else{
			const userDoc = userSnapshot.docs[0]
			const user = userDoc.data()
			
			const isMatch = bcrypt.compareSync(password, user.password);  //user.password는 암호화된 것
			if(!isMatch){
				throw new Error('패스워드가 일치하지 않습니다.')
			} else{
				// JWT 생성
                const token = jwt.sign({ id: userDoc.id }, secretKey, { expiresIn: '1d' });
				console.log('로그인 성공')
				return res.status(200).json({status:'success', user, token})
			}
		}
	}catch(e){
		return res.status(409).json({status:'fail', error:e.message})
	}
}
userController.loginWithGoogle= async(req, res)=>{
	try{
		//토큰값을 읽어온다.
		const {token} = req.body
		const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID)
		const tokenInfo = await googleClient.verifyIdToken({
			idToken: token,
			audience: GOOGLE_CLIENT_ID
		})
		const {email, name} = tokenInfo.getPayload()
		let userSnapshot = await usersCollection.where('email','==',email).get()

		let user;
		let userDoc;
		if(userSnapshot.empty){ 
			// user를 생성한다.
			const randomPassword = ''+Math.floor(Math.random()*100000) //문자열로 만들기
			const hash = bcrypt.hashSync(randomPassword, saltRounds)

			user = {
				email,
				password: hash, 
				name, 
				level:level? level :'customer'
			}
			const userRef = await usersCollection.add(user)	
			console.log('생성된 user정보 :', user)
			userDoc = await userRef.get();
		} else{
			userDoc = userSnapshot.docs[0]
		}

		// 기존 user가 있던가, 없을 경우 새로 만든 user가 생성되면, 토큰을 발행하고 리턴
		user = userDoc.data()

		const sessionToken = jwt.sign({ userId: userDoc.id }, secretKey, { expiresIn: '1d' });
		res.status(200).json({status:'success', user, token:sessionToken})
	}catch(e){
		return res.status(409).json({status:'fail', error:e.message})
	}
}

userController.getUser=async(req, res)=>{
	try{
		const userId = req.userId
		let userSnapshot = await usersCollection.where('email','==',email).get()
		const userDoc = userSnapshot.docs[0]
		const user = userDoc.data()

		if(!user){
			throw new Error('can not find user')
		}
		res.status(200).json({status:'success', user })
	}catch(e){
		res.status(400).json({status:'fail', error:e.message})
	}
}

module.exports = userController;