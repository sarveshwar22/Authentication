const express = require('express')
const path = require('path')

const bodyParser = require('body-parser')

const app=express()
app.use('/',express.static(path.join(__dirname,'static')))

app.use(bodyParser.json())


app.post('/api/register', async (req, res) => {
	console.log(req.body)
    res.json({status:'ok'})
})

app.listen(3000, () => {
	console.log('Server up at 3000')
})