const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			require: true,
		},
		fullname: {
			type: String,
			require: true,
		},
		note: {
			type: String,
			default: '',
		},
		password: {
			type: String,
			require: true,
		},
		role: {
			type: Number,
			default: 1, // 0: admin, 1: user
		},
		price: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Users', usersSchema)
