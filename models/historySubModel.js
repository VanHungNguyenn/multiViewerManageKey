const mongoose = require('mongoose')

const historySubSchema = new mongoose.Schema(
	{
		nameUser: {
			type: String,
			require: true,
		},
		nameProduct: {
			type: String,
			require: true,
		},
		title: {
			type: String,
			require: true,
		},
		price: {
			type: Number,
			require: true,
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model('HistorySubModel', historySubSchema)
