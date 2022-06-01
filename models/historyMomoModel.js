const mongoose = require('mongoose')

const historyMomoSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	nameUser: {
		type: String,
		default: null,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	status: {
		type: String,
		default: null,
	},
	comment: {
		type: String,
		default: null,
	},
})

module.exports = mongoose.model('HistoryMomoModel', historyMomoSchema)
