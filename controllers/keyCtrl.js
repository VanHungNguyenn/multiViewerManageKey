const KeyModel = require('../models/keyModel')
const { isNumber } = require('../utils')

const keyCtrl = {
	addKey: async (req, res) => {
		try {
			const { key, total, note, seller, expired, forever } = req.body
			// validate
			if (!key || !total || !seller || !expired) {
				return res
					.status(400)
					.json({ msg: 'Please fill in all fields' })
			}
			// check total is number?
			if (!isNumber(total)) {
				return res.status(400).json({ msg: 'Total must be a number' })
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
				res.status(200).json({ msg: 'Key added' })
			})
		} catch (error) {
			return res.status(500).json({ msg: error.message })
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

			res.status(200).json({ total: result.length, keys })
		} catch (error) {
			return res.status(500).json({ msg: error.message })
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
					.json({ msg: 'Please fill in all fields' })
			}

			await KeyModel.findByIdAndUpdate(
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
				res.status(200).json({ msg: 'Key updated' })
			})
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
}

const machinesCtrl = {
	addMachine: async (req, res) => {
		try {
			const {
				machineId,
				deviceId,
				sessionId,
				used,
				createdDate,
				lastUsedDate,
				note,
				tag,
			} = req.body

			if (!machineId || !deviceId || !sessionId || !createdDate) {
				return res.status(400).json({
					msg: 'Please fill in all fields! (machineId, deviceId, sessionId, createdDate is required)',
				})
			}

			const newMachine = new Machines({
				machineId,
				deviceId,
				sessionId,
				used,
				createdDate,
				lastUsedDate,
				note,
				tag,
			})

			await newMachine.save()

			res.status(200).json({ msg: 'Machine has been added successfully' })
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	updateMachine: async (req, res) => {
		try {
			const { id } = req.params

			const {
				deviceId,
				sessionId,
				used,
				createdDate,
				lastUsedDate,
				note,
				tag,
			} = req.body

			await Machines.findOneAndUpdate(
				{ _id: id },
				{
					deviceId,
					sessionId,
					used,
					createdDate,
					lastUsedDate,
					note,
					tag,
				}
			).then((machine) => {
				if (!machine) {
					return res.status(200).json({ msg: 'Machine not found' })
				} else {
					res.status(200).json({ msg: 'Update successfully!' })
				}
			})
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	deleteMachine: async (req, res) => {
		try {
			const { id } = req.params

			await Machines.findByIdAndDelete(id).then((machine) => {
				if (!machine) {
					return res.status(404).json({ msg: 'Machine not found' })
				} else {
					res.status(200).json({
						msg: 'Deleted machine successfully!',
					})
				}
			})
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	getMachinesInfo: async (req, res) => {
		try {
			const { page, limit } = req.query

			const result = await Machines.find()
				.sort({ createdAt: 1 })
				.limit(limit ? Number(limit) : null)
				.skip(page ? (Number(page) - 1) * Number(limit) : null)

			res.status(200).json({ total: result.length, result })
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	getInfo: async (req, res) => {
		try {
			const { tag, usedMax, usedMin, dateStart, dateEnd, page, limit } =
				req.query

			let conditions = {}

			if (tag) {
				conditions['tag'] = tag
			}

			if (usedMin || usedMax) {
				conditions['used'] = {}

				if (usedMin) {
					conditions.used['$gte'] = Number(usedMin)
				}

				if (usedMax) {
					conditions.used['$lte'] = Number(usedMax)
				}
			}

			if (dateStart || dateEnd) {
				conditions['createdDate'] = {}

				if (dateStart) {
					conditions.createdDate['$gte'] = new Date(dateStart)
				}
				if (dateEnd) {
					conditions.createdDate['$lte'] = new Date(dateEnd)
				}
			}

			const result = await Machines.find(conditions)
				.sort({ createdAt: -1 })
				.limit(limit ? Number(limit) : null)
				.skip(page ? (Number(page) - 1) * Number(limit) : null)

			const total_count_db = await Machines.find(conditions)

			res.status(200).json({
				total_count_db: total_count_db.length,
				total: result.length,
				result,
			})
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	findone: async (req, res) => {
		try {
			const result = await Machines.findOne()

			res.status(200).json({ result })
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	// test: async (req, res) => {
	// 	try {
	// 		const { used, page, limit } = req.query

	// 		let conditions = {}

	// 		if (used) {
	// 			conditions['used'] = used
	// 		}

	// 		const result = await Machines.find(conditions)
	// 			.sort({ createdAt: -1 })
	// 			.limit(limit ? Number(limit) : null)
	// 			.skip(page ? (Number(page) - 1) * Number(limit) : null)

	// 		const total_count_db = await Machines.find(conditions)

	// 		res.status(200).json({
	// 			total_count_db: total_count_db.length,
	// 			total: result.length,
	// 			result,
	// 		})
	// 	} catch (error) {
	// 		return res.status(500).json({ msg: error.message })
	// 	}
	// },
}

module.exports = keyCtrl
