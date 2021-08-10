const express = require('express')
const path = require('path')
const mongoose = require('mongoose')

const User = require('./model/user')

const bcrypt= require('bcryptjs')

const jwt = require('jsonwebtoken')

const JWT_SECRET = "fkewbwEBJEWJXBXEjhxbi23u23fg2dvzdt2ty$^%&!^@&^&^&@#cec*cd"

mongoose.connect('mongodb://localhost:27017/login-app-db', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})

mongoose.connection
	.once("open",() =>console.log("Mongoose connected"))
	.on("error", error =>{
		console.log("Your Error----------",error);
	})

const bodyParser = require('body-parser')

const app=express()
app.use('/',express.static(path.join(__dirname,'static')))

app.use(bodyParser.json())


app.post('/api/change-password', async (req, res) => {
	const { token, newpassword: plainTextPassword } = req.body

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	try {
		const user = jwt.verify(token, JWT_SECRET)

		const _id = user.id

		const password = await bcrypt.hash(plainTextPassword, 10)

		await User.updateOne(
			{ _id },
			{
				$set: { password }
			}
		)
		res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: ';))' })
	}
})

app.post('/api/login', async (req, res) => {
	const { username, password } = req.body
	const user = await User.findOne({ username }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		
		const token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			JWT_SECRET
		)

		return res.json({ status: 'ok', data: token })
	}

	res.json({ status: 'error', error: 'Invalid username/password' })
})

app.post('/api/register', async (req, res) => {

    const {username, password:plainTextPassword} = req.body
	// console.log(username)
	// console.log(plainTextPassword)

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
	} catch (error) {
		if (error.code === 11000) {
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
		// console.log(error.code)
        // console.log(error)
        // return res.json({ status: 'error'})
	}
    console.log("Hello")
    // console.log(req.body)
    res.json({status:'ok'})
})

app.listen(3000, () => {
	console.log('Server up at 3000')
})