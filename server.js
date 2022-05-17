require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()

const PORT = process.env.PORT || 5015

app.use(express.json())
app.use(cors())
app.use(cookieParser())

// Routes
app.use('/user', require('./routes/userRouter'))
app.use('/key', require('./routes/keyRouter'))

// Connect to mongoose
const URI = process.env.MONGODB_URL
mongoose.connect(URI, (err) => {
	if (err) throw err
	console.log('Connected to mongodb')
})

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`)
})
