const KeyModel = require('../models/keyModel')
const HistoryModel = require('../models/historyModel')
const { isNumber } = require('../utils')

const keyCtrl = {
	addKey: async (req, res) => {
		try {
			const { key, total, note, seller, expired, forever } = req.body
			// validate
			if (!key || !total || !seller || !expired) {
				return res
					.status(400)
					.json({ message: 'Key, price, expired is required!' })
			}
			// check total is number?
			if (!isNumber(total)) {
				return res
					.status(400)
					.json({ message: 'Total must be a number' })
			}

			const newKey = new KeyModel({
				key,
				total,
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
			const { key, note, expired, forever } = req.body
			// validate
			if (!key || !expired) {
				return res
					.status(400)
					.json({ message: 'Please fill in all fields' })
			}

			await KeyModel.findOneAndUpdate(
				{
					id_key: id,
				},
				{
					key,
					note,
					expired,
					forever,
				}
			).then(() => {
				res.status(200).json({ message: 'Key updated' })
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	deleteKey: async (req, res) => {
		try {
			const { id } = req.params
			await KeyModel.findOneAndUpdate({ id_key: id }).then(() => {
				res.status(200).json({ message: 'Key deleted' })
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
}

module.exports = keyCtrl
