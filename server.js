require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const cron = require('node-cron')

const handleAutoMomo = require('./cron/handleAutoMomo')

const app = express()

const PORT = process.env.PORT || 5015

app.use(express.json())
app.use(cors())
app.use(cookieParser())

// Routes
app.use('/api/user', require('./routes/userRouter'))
app.use('/api/key', require('./routes/keyRouter'))
app.use('/api/product', require('./routes/productRouter'))
app.use('/api/account', require('./routes/accountsRouter'))
app.use((req, res, next) => {
	const error = new Error('Not found')
	error.status = 404
	next(error)
})
app.use((error, req, res, next) => {
	res.status(error.status || 500)
	res.json({
		message: error.message,
	})
})

// Connect to mongoose
const URI = process.env.MONGODB_URL

mongoose.connect(URI, (err) => {
	if (err) throw err
	console.log('Connected to mongodb')
})

handleAutoMomo()

cron.schedule('* * * * *', () => {
	try {
		console.log('Running cron job every minute')
	} catch (error) {
		console.log(error)
	}
})

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`)
})
