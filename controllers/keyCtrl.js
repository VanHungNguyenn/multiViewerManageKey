const KeyModel = require('../models/keyModel')
const { isNumber } = require('../utils')

const keyCtrl = {
	addKey: async (req, res) => {
		try {
			const { key, price, note, seller, expired, forever } = req.body
			// validate
			if (!key || !price || !seller || !expired) {
				return res
					.status(400)
					.json({ message: 'Key, price, expired is required!' })
			}
			// check price is number?
			if (!isNumber(price)) {
				return res
					.status(400)
					.json({ message: 'price must be a number' })
			}

			const newKey = new KeyModel({
				key,
				price,
				note,
				seller,
				expired,
				forever,
			})

			await newKey.save().then(() => {
				res.status(200).json({ message: 'Key added' })
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	getAllKey: async (req, res) => {
		try {
			const { page, limit } = req.query

			const keys = await KeyModel.find()
				.sort({ createdAt: 1 })
				.limit(limit ? Number(limit) : null)
				.skip(
					page
						? (Number(page) - 1) * (limit ? Number(limit) : null)
						: null
				)

			res.status(200).json({ total: keys.length, keys })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	updateKey: async (req, res) => {
		try {
			const { id } = req.params
			const { key, note, expired, forever, price } = req.body
			// validate
			if (!key || !expired) {
				return res
					.status(400)
					.json({ message: 'Please fill in all fields' })
			}

			await KeyModel.findByIdAndUpdate(id, {
				key,
				note,
				expired,
				forever,
				price,
			}).then(() => {
				res.status(200).json({ message: 'Key updated' })
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	deleteKey: async (req, res) => {
		try {
			const { id } = req.params

			await KeyModel.findByIdAndDelete(id).then(() => {
				res.status(200).json({ message: 'Key deleted' })
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	getKey: async (req, res) => {
		try {
			const { id } = req.params

			await KeyModel.findById(id).then((key) => {
				res.status(200).json(key)
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	getAllInfor: async (req, res) => {
		try {
			const keys = await KeyModel.find()
			const totalPrice = keys.reduce((acc, key) => {
				return acc + key.price
			}, 0)

			const totalKey = keys.length

			res.status(200).json({ totalKey, totalPrice })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
}

module.exports = keyCtrl
