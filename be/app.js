const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const indexRouter = require('./routes/index')
const app = express()

require('dotenv').config()
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json()) // req.body가 객체로 인식이 된다.
app.use('/api', indexRouter)


app.listen(process.env.PORT || 5001, ()=>{
	console.log('Server is on 5001')
})


