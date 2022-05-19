const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const keySchema = new mongoose.Schema(
	{
		key: {
			type: String,
			required: true,
			unique: true,
		},
		price: {
			type: Number,
			required: true,
		},
		note: {
			type: String,
			default: '',
		},
		seller: {
			type: String,
			required: true,
		},
		expired: {
			type: Date,
			required: true,
		},
		forever: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
)

keySchema.plugin(AutoIncrement, { inc_field: 'id_key' })

module.exports = mongoose.model('KeyModel', keySchema)
