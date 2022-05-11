const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			require: true,
			unique: true,
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

userSchema.plugin(AutoIncrement, { inc_field: 'id_user' })
module.exports = mongoose.model('Users', userSchema)
