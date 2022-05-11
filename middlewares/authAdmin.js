const UserModel = require('../models/userModel')

const authAdmin = async (req, res, next) => {
	try {
		const user = await UserModel.findOne({
			_id: req.user.id,
		})

		if (user.role !== 0) {
			return res.status(400).json({
				message: 'You are not authorized to access this page',
			})
		}

		next()
	} catch (error) {
		return res.status(500).json({ msg: error.message })
	}
}

module.exports = authAdmin
