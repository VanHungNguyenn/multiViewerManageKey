const mongoose = require('mongoose')

const accountsSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		unique: true,
	},
	api: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		default: null,
	},
})

module.exports = mongoose.model('AccountsModel', accountsSchema)
