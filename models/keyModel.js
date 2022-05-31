const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const keySchema = new mongoose.Schema(
	{
		key: {
			type: String,
			required: true,
			unique: true,
		},
		idProduct: {
			type: Number,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		idName: {
			type: Number,
			default: null,
		},
		note: {
			type: String,
			default: '',
		},
		seller: {
			type: String,
			default: null,
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
