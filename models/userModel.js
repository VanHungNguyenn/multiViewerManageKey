const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			require: true,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			require: true,
		},
		email: {
			type: String,
			require: true,
		},
		role: {
			type: Number,
			default: 2, // 0: admin, 1: seller, 2: user
		},
		note: {
			type: String,
			default: '',
		},
		totalDeposit: {
			type: Number,
			default: 0,
		},
		balance: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
)

userSchema.plugin(AutoIncrement, { inc_field: 'id_user' })
module.exports = mongoose.model('UserModel', userSchema)
