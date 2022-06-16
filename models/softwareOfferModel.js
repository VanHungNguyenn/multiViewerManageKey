const mongoose = require('mongoose')

const softwareOfferSchema = new mongoose.Schema({
	softwareId: {
		type: Number,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	originalPrice: {
		type: Number,
		default: null,
	},
	discountValue: {
		type: Number,
		default: null,
	},
	value: {
		type: Number,
		required: true,
	},
	note: {
		type: String,
		default: null,
	},
	tag: {
		type: String,
		default: null,
	},
})

module.exports = mongoose.model('SoftwareOfferModel', softwareOfferSchema)
