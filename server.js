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


    if (!username || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

    const password = await bcrypt.hash(plainTextPassword, 10)
    
    try {
		const response = await User.create({
			username,
			password
		})
		console.log('User created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) {
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
	}
    
    console.log(req.body)
    res.json({status:'ok'})
})

app.listen(3000, () => {
	console.log('Server up at 3000')
})