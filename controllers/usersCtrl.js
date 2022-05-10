const Users = require('../models/usersModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const usersCtrl = {
	register: async (req, res) => {
		try {
			const { name, password } = req.body

			if (!name || !password) {
				return res
					.status(400)
					.json({ msg: 'Please fill in all fields.' })
			}

			const user = await Users.findOne({ name })

			if (user) {
				return res
					.status(400)
					.json({ msg: 'This name already exists.' })
			}

			if (password.length < 6) {
				return res
					.status(400)
					.json({ msg: 'Password must be at least 6 characters' })
			}

			const passwordHash = await bcrypt.hash(password, 12)

			const newUser = new Users({ name, password: passwordHash })
			await newUser.save()

			res.status(200).json({ msg: 'Register success!' })
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	login: async (req, res) => {
		try {
			const { name, password } = req.body
			const user = await Users.findOne({ name })
			if (!user) {
				return res
					.status(400)
					.json({ msg: 'This username does not exist.' })
			}
			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch) {
				return res
					.status(400)
					.json({ msg: 'Username or password is incorrect.' })
			}

			const refresh_token = createRefreshToken({ id: user._id })

			res.cookie('refreshtoken', refresh_token, {
				httpOnly: true,
				path: '/user/refresh_token',
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			})

			res.status(200).json({ msg: 'Login success!' })
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	getAccessToken: (req, res) => {
		try {
			const rf_token = req.cookies.refreshtoken

			if (!rf_token) {
				return res.status(400).json({ msg: 'Please login now!' })
			}

			jwt.verify(
				rf_token,
				process.env.REFRESH_TOKEN_SECRET,
				(err, user) => {
					if (err) {
						return res
							.status(400)
							.json({ msg: 'Please login now!' })
					}

					const access_token = createAccessToken({ id: user.id })

					res.status(200).json({ access_token })
				}
			)
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	getUserInfor: async (req, res) => {
		try {
			const user = await Users.findById(req.user.id).select('-password')

			res.json(user)
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
	logout: async (req, res) => {
		try {
			res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
			return res.json({ msg: 'Logged out.' })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
}

const createRefreshToken = (payload) => {
	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: '7d',
	})
}

const createAccessToken = (payload) => {
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: '15m',
	})
}

module.exports = usersCtrl
