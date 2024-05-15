const express = require('express')
const admin = require("firebase-admin");
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const indexRouter = require('./routes/index')
const app = express()

require('dotenv').config()
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json()) // req.body가 객체로 인식이 된다.
app.use('/api', indexRouter)

const serviceAccount = require("../config/applemarket-firebase-adminsdk-key.json");

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const mongoURI = process.env.LOCAL_DB_ADDRESS
mongoose.connect(mongoURI)
	.then(()=>console.log('mongoose connected'))
	.catch((e)=>console.log("DB connection fail", e.message))

app.listen(process.env.PORT || 5001, ()=>{
	console.log('Server is on 5001')
})


module.exports = firebaseApp