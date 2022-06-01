const mongoose = require('mongoose')

const historyBankSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
	},
	nameUser: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
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

module.exports = mongoose.model('HistoryBankModel', historyBankSchema)
