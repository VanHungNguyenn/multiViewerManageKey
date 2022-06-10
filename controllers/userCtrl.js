const UserModel = require('../models/userModel')
const HistoryTransactionModel = require('../models/historyTransactionModel')
const KeyModel = require('../models/keyModel')
const ProductModel = require('../models/productModel')
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
	getSoftware: async (req, res) => {
		try {
			const { id } = req.params

			const keys = await KeyModel.find({
				idName: id,
			})

			if (!keys) {
				return res.status(400).json({
					message: 'Software not found',
				})
			}

			const allProducts = await ProductModel.find()

			const softwares = keys.map((key) => {
				const product = allProducts.find(
					(product) => product.id_product === key.idProduct
				)

				return {
					...key._doc,
					nameProduct: product ? product._doc.nameProduct : null,
				}
			})

			res.status(200).json({
				software,
				message: 'Get software success',
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

			const { value, action } = req.body

			if (!value || !action) {
				return res.status(400).json({
					message: 'Missing required fields',
				})
			}

			const user = await UserModel.findById(id)

			if (!user) {
				return res.status(400).json({
					message: 'User not found',
				})
			}

			if (action === '+') {
				user.balance += parseInt(value)
				user.totalDeposit += parseInt(value)
			} else {
				user.balance -= parseInt(value)
			}

			await user.save()

			res.status(200).json({
				message: 'Change balance success',
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
}

module.exports = userCtrl
