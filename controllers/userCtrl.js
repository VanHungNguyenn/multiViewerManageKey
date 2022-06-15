const UserModel = require('../models/userModel')
const HistoryTransactionModel = require('../models/historyTransactionModel')
const bcrypt = require('bcrypt')
const { createAccessToken, validateEmail } = require('../utils')

const userCtrl = {
	register: async (req, res) => {
		try {
			const { name, email, password, confirmPassword } = req.body

			if (!name || !email || !password || !confirmPassword) {
				return res.status(400).json({
					message: 'Missing required fields',
				})
			}

			// validate name
			if (name.length < 6) {
				return res.status(400).json({
					message: 'Name must be at least 6 characters',
				})
			}

			if (password.length < 6) {
				return res.status(400).json({
					message: 'Password must be at least 6 characters',
				})
			}

			if (password !== confirmPassword) {
				return res.status(400).json({
					message: 'Password and confirm password must match',
				})
			}

			if (!validateEmail(email)) {
				return res.status(400).json({
					message: 'Email is invalid',
				})
			}

			const user = await UserModel.findOne({ name })

			if (user) {
				return res.status(400).json({
					message: 'Username is already exists',
				})
			}

			const hashPassword = await bcrypt.hash(password, 12)

			const newUser = new UserModel({
				name,
				password: hashPassword,
				email,
			})

			await newUser.save()

			res.status(200).json({
				message: 'Register user successfully',
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	login: async (req, res) => {
		try {
			const { name, password } = req.body

			if (!name || !password) {
				return res.status(400).json({
					message: 'Username and password are required',
				})
			}

			const user = await UserModel.findOne({ name })

			if (!user) {
				return res.status(400).json({
					message: 'Username or password is incorrect',
				})
			}

			const isMatch = await bcrypt.compare(password, user.password)

			if (!isMatch) {
				return res.status(400).json({
					message: 'Username or password is incorrect',
				})
			}

			const token = createAccessToken({ id: user._id, name: user.name })

			res.status(200).json({
				message: 'Login success',
				token,
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	getProfile: async (req, res) => {
		try {
			const user = await UserModel.findOne({ _id: req.user.id }).select(
				'-password'
			)

			if (!user) {
				return res.status(400).json({
					message: 'User not found',
				})
			}

			res.status(200).json({
				user,
				message: 'Get user profile success',
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	getHistoryRecharge: async (req, res) => {
		try {
			const history = await HistoryTransactionModel.find({
				nameUser: req.user.name,
			})

			if (!history) {
				return res.status(400).json({
					message: 'History not found',
				})
			}

			res.status(200).json({
				history,
				message: 'Get history recharge success',
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	getAllInfor: async (req, res) => {
		try {
			const users = await UserModel.find().select('-password')

			if (!users) {
				return res.status(400).json({
					message: 'Users not found',
				})
			}

			res.status(200).json({
				users,
				message: 'Get users infor success',
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	createNewUser: async (req, res) => {
		try {
			const { name, email, password, role, note } = req.body

			if (!name || !email || !password) {
				return res.status(400).json({
					message: 'Missing required fields',
				})
			}

			if (password.length < 6) {
				return res.status(400).json({
					message: 'Password must be at least 6 characters',
				})
			}

			if (!validateEmail(email)) {
				return res.status(400).json({
					message: 'Email is invalid',
				})
			}

			const user = await UserModel.findOne({ name })

			if (user) {
				return res.status(400).json({
					message: 'Username is already exists',
				})
			}

			const hashPassword = await bcrypt.hash(password, 12)

			const newUser = new UserModel({
				name,
				password: hashPassword,
				email,
				role,
				note,
			})

			await newUser.save()

			res.status(200).json({
				message: 'Register user successfully',
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	updateUser: async (req, res) => {
		try {
			const { id } = req.params

			const { email, note, role, password } = req.body

			if (!email) {
				return res.status(400).json({
					message: 'Email is required',
				})
			}

			if (!validateEmail(email)) {
				return res.status(400).json({
					message: 'Email is invalid',
				})
			}

			const user = await UserModel.findById(id)

			if (!user) {
				return res.status(400).json({
					message: 'User not found',
				})
			}

			let hashPassword = user.password

			// if password is not empty, then hash password, else keep password

			if (password) {
				// validate password
				if (password.length < 6) {
					return res.status(400).json({
						message: 'Password must be at least 6 characters',
					})
				}

				hashPassword = await bcrypt.hash(password, 12)
			}

			const newUser = {
				email,
				note,
				role,
				password: hashPassword,
			}

			await UserModel.findByIdAndUpdate(id, newUser)

			res.status(200).json({
				message: 'Update user success',
			})
		} catch (error) {
			return res.status(500).json({ error: error.message })
		}
	},
	deleteUser: async (req, res) => {
		try {
			const { id } = req.params

			await UserModel.findByIdAndDelete(id).then((user) => {
				if (!user) {
					return res.status(400).json({
						message: 'User not found',
					})
				} else {
					res.status(200).json({
						message: 'User deleted',
					})
				}
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	getProfileById: async (req, res) => {
		try {
			const { id } = req.params

			const user = await UserModel.findById(id).select('-password')

			if (!user) {
				return res.status(400).json({
					message: 'User not found',
				})
			}

			res.status(200).json({
				user,
				message: 'Get user infor success',
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	changeBalance: async (req, res) => {
		try {
			const { id } = req.params

			const { valuesChange, action } = req.body

			if (!valuesChange) {
				return res.status(400).json({
					message: 'Value change is required',
				})
			}

			// check valuesChange is number
			if (isNaN(parseInt(valuesChange))) {
				return res.status(400).json({
					message: 'Value change must be number',
				})
			}

			if (action !== 'add' && action !== 'sub') {
				return res.status(400).json({
					message: 'Action must be add or sub',
				})
			}

			const user = await UserModel.findById(id)

			if (!user) {
				return res.status(400).json({
					message: 'User not found',
				})
			}

			if (action === 'add') {
				user.balance += parseInt(valuesChange)
				user.totalDeposit += parseInt(valuesChange)

				await user.save()

				return res.status(200).json({
					message: 'Add balance successfully',
				})
			} else {
				if (user.balance < parseInt(valuesChange)) {
					return res.status(400).json({
						message: 'Balance is not enough',
					})
				}

				user.balance -= parseInt(valuesChange)
				user.totalDeposit -= parseInt(valuesChange)

				await user.save()

				return res.status(200).json({
					message: 'Sub balance successfully',
				})
			}
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
}

module.exports = userCtrl
