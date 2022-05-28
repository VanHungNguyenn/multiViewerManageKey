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
