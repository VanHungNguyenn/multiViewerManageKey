const mongoose = require('mongoose')

const softwareSchema = new mongoose.Schema(
	{
		softwareId: {
			type: Number,
			required: true,
			unique: true,
		},
		nameProduct: {
			type: String,
			required: true,
			unique: true,
		},
		desc: {
			type: String,
			default: null,
		},
		imgUrl: {
			type: String,
			default: 'https://via.placeholder.com/150',
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
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('SoftwareModel', softwareSchema)
