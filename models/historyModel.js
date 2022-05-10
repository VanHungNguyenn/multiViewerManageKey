const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const historyModel = new mongoose.Schema(
	{
		key: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		purchaseDate: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
)

historyModel.plugin(AutoIncrement, { inc_field: 'id_history' })

module.exports = mongoose.model('HistoryModel', historyModel)
