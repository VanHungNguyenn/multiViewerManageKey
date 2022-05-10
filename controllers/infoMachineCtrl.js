const InfoMachine = require('../models/infoMachineModel')

const infoMachineCtrl = {
	addInfo: async (req, res) => {
		try {
			const { machineId, data, note } = req.body

			if (!machineId || !data) {
				return res.status(400).json({
					msg: 'Please fill in all fields!',
				})
			}

			const newInfo = new InfoMachine({
				machineId,
				data,
				note,
			})

			await newInfo.save()

			res.status(200).json({ msg: 'Info has been added successfully' })
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	updateInfo: async (req, res) => {
		try {
			const { machineId } = req.params

			const { data, note } = req.body

			await InfoMachine.findOneAndUpdate(
				{ machineId: machineId },
				{
					data,
					note,
				}
			).then((info) => {
				if (!info) {
					return res.status(404).json({ msg: 'Info not found' })
				} else {
					res.status(200).json({
						msg: 'Info has been updated successfully',
					})
				}
			})
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	deleteInfo: async (req, res) => {
		try {
			const { machineId } = req.params

			await InfoMachine.findOneAndDelete({ machineId: machineId }).then(
				(info) => {
					if (!info) {
						return res.status(404).json({ msg: 'Info not found' })
					} else {
						res.status(200).json({
							msg: 'Info has been deleted successfully',
						})
					}
				}
			)
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	getInfo: async (req, res) => {
		try {
			const { page, limit, idStart, idEnd } = req.query

			let conditions = {}

			if (idStart || idEnd) {
				conditions['id_info_machine'] = {}

				if (idStart) {
					conditions.id_info_machine['$gte'] = idStart
				}
				if (idEnd) {
					conditions.id_info_machine['$lte'] = idEnd
				}
			}

			const result = await InfoMachine.find(conditions)
				.sort({ createdAt: 1 })
				.limit(limit ? Number(limit) : null)
				.skip(page ? (Number(page) - 1) * Number(limit) : null)

			const total_count_db = await InfoMachine.find(conditions)

			res.status(200).json({
				total_count_db: total_count_db.length,
				total: result.length,
				result,
			})
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
}

module.exports = infoMachineCtrl
