const express = require('express')
const path = require('path')
const mongoose = require('mongoose')

const User = require('./model/user')

const bcrypt= require('bcryptjs')

mongoose.connect('mongodb://localhost:27017/login-app-db', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})
const bodyParser = require('body-parser')

const app=express()
app.use('/',express.static(path.join(__dirname,'static')))

app.use(bodyParser.json())


app.post('/api/register', async (req, res) => {

    const { username, password: plainTextPassword } = req.body

    const password = await bcrypt.hash(plainTextPassword, 10)
    
    
    console.log(req.body)
    res.json({status:'ok'})
})

app.listen(3000, () => {
	console.log('Server up at 3000')
})