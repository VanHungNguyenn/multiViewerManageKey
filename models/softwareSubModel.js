const mongoose = require('mongoose')

const softwareSubSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			require: true,
		},
		productId: {
			type: String,
			require: true,
		},
		expDate: {
			type: Date,
			default: Date.now,
		},
		note: {
			type: String,
			default: null,
		},
		tag: {
			type: String,
			default: null,
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model('SoftwareSubModel', softwareSubSchema)
