const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const productSchema = new mongoose.Schema(
	{
		nameProduct: {
			type: String,
			require: true,
			unique: true,
		},
		price: {
			type: Number,
			require: true,
		},
		price1: {
			type: Number,
			default: null,
		},
		price2: {
			type: Number,
			default: null,
		},
		price3: {
			type: Number,
			default: null,
		},
		desc: {
			type: String,
			default: null,
		},
	},
	{
		timestamps: true,
	}
)

productSchema.plugin(AutoIncrement, { inc_field: 'id_product' })
module.exports = mongoose.model('ProductModel', productSchema)
