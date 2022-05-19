const UserModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { createAccessToken } = require('../utils')

const userCtrl = {
	register: async (req, res) => {
		try {
			const { name, fullname, password, note, role, total } = req.body

			if (!name || !fullname || !password) {
				return res.status(400).json({
					message: 'User name, full name and password are required',
				})
			}

			const user = await UserModel.findOne({ name })

			if (user) {
				return res.status(400).json({
					message: 'User name is already exists',
				})
			}

			if (password.length < 6) {
				return res.status(400).json({
					message: 'Password must be at least 6 characters long',
				})
			}

			const hashPassword = await bcrypt.hash(password, 12)

			const newUser = new UserModel({
				name,
				fullname,
				password: hashPassword,
				note,
				role,
				total,
			})

			await newUser.save()

			res.status(200).json({
				message: 'User created',
			})
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	login: async (req, res) => {
		try {
			const { name, password } = req.body

			if (!name || !password) {
				return res.status(400).json({
					message: 'User name and password are required',
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

			const token = createAccessToken({ id: user._id })

			res.status(200).json({
				message: 'Login success',
				token,
			})
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	logout: async (req, res) => {
		try {
			res.status(200).json({
				message: 'Logout success',
			})
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	getInfor: async (req, res) => {
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
				message: 'Get user infor success',
			})
		} catch (error) {
			return res.status(500).json({ msg: error.message })
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
			return res.status(500).json({ msg: error.message })
		}
	},
	updateUser: async (req, res) => {
		try {
			const { id } = req.params

			const { fullname, note, role, password } = req.body

			if (!fullname) {
				return res.status(400).json({
					message: 'Full name is required',
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
				hashPassword = await bcrypt.hash(password, 12)
			}

			const newUser = {
				fullname,
				note,
				role,
				password: hashPassword,
			}

			await UserModel.findByIdAndUpdate(id, newUser)

			res.status(200).json({
				message: 'Update user success',
			})
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	create: async (req, res) => {
		try {
			const { name, fullname, password, note, role, total } = req.body

			if (!name || !fullname) {
				return res.status(400).json({
					message: 'User name, full name and password are required',
				})
			}

			const user = await UserModel.findOne({ name })

			if (user) {
				return res.status(400).json({
					message: 'User name is already exists',
				})
			}

			if (password.length < 6) {
				return res.status(400).json({
					message: 'Password must be at least 6 characters long',
				})
			}

			const hashPassword = await bcrypt.hash(password, 12)

			const newUser = new UserModel({
				name,
				fullname,
				password: hashPassword,
				note,
				role,
				total,
			})

			await newUser.save()

			res.status(200).json({
				message: 'User created',
			})
		} catch (error) {
			return res.status(500).json({ msg: error.message })
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
			return res.status(500).json({ msg: error.message })
		}
	},
	getInforById: async (req, res) => {
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
			return res.status(500).json({ msg: error.message })
		}
	},
}

module.exports = userCtrl
