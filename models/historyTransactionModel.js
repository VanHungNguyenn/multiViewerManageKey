const mongoose = require('mongoose')

const historyTransactionSchema = new mongoose.Schema({
	nameUser: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	note: {
		type: String,
		default: null,
	},
	date: {
		type: Date,
		default: Date.now,
	},
})

module.exports = mongoose.model(
	'HistoryTransactionModel',
	historyTransactionSchema
)
