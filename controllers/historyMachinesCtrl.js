const Machines = require('../models/keyModel')
const HistoryMachines = require('../models/historyMachinesModel')

const historyMachinesCtrl = {
	addHistoryMachine: async (req, res) => {
		try {
			const {
				IP,
				computerName,
				machineId,
				verifySuccess,
				registerSuccess,
				email,
				emailPassword,
				UID,
				password,
				createdDate,
				note,
				tag,
				elapsed,
				beforeRegister,
				beforeLogin,
				beforeVerify,
			} = req.body

			if (
				!IP ||
				!computerName ||
				!email ||
				!emailPassword ||
				!UID ||
				!password ||
				!createdDate
			) {
				return res.status(400).json({
					msg: 'Please fill in all fields!',
				})
			}

			const newHistoryMachine = new HistoryMachines({
				IP,
				computerName,
				machineId,
				verifySuccess,
				registerSuccess,
				email,
				emailPassword,
				UID,
				password,
				createdDate,
				note,
				tag,
				elapsed,
				beforeRegister,
				beforeLogin,
				beforeVerify,
			})

			await newHistoryMachine.save()

			res.status(200).json({
				msg: 'History machine has been added successfully',
			})
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	updateHistoryMachine: async (req, res) => {
		try {
			const { id } = req.params

			const {
				IP,
				computerName,
				machineId,
				verifySuccess,
				registerSuccess,
				email,
				emailPassword,
				UID,
				password,
				createdDate,
				note,
				tag,
				elapsed,
				beforeRegister,
				beforeLogin,
				beforeVerify,
			} = req.body

			await HistoryMachines.findOneAndUpdate(
				{ _id: id },
				{
					IP,
					computerName,
					machineId,
					verifySuccess,
					registerSuccess,
					email,
					emailPassword,
					UID,
					password,
					createdDate,
					note,
					tag,
					elapsed,
					beforeRegister,
					beforeLogin,
					beforeVerify,
				}
			).then((machine) => {
				if (!machine) {
					return res.status(400).json({ msg: 'Machine not found' })
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

			await HistoryMachines.findByIdAndDelete(id)

			res.status(200).json({
				msg: 'Deleted history machine successfully!',
			})
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	getHistoryMachinesInfo: async (req, res) => {
		try {
			const { page, limit } = req.query

			const result = await HistoryMachines.find()
				.sort({ createdAt: -1 })
				.limit(limit ? Number(limit) : null)
				.skip(page ? (Number(page) - 1) * Number(limit) : null)
				.then(async (machines) => {
					const newHistoryMachine = []

					for (let i = 0; i < machines.length; i++) {
						const machine = machines[i]
						await Machines.findOne({
							machineId: machine.machineId,
						}).then((mc) => {
							let newMc = { ...machine }._doc

							if (!mc) {
								newMc.dataMachine = null
							} else {
								newMc.dataMachine = mc
							}

							newHistoryMachine.push(newMc)
						})
					}
					return newHistoryMachine
				})

			res.status(200).json({ total: result.length, result })
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	getInfo: async (req, res) => {
		try {
			const {
				IP,
				computerName,
				machineId,
				verifySuccess,
				registerSuccess,
				dateStart,
				dateEnd,
				page,
				limit,
				idStart,
				idEnd,
			} = req.query

			let conditions = {}

			if (IP) {
				conditions['IP'] = IP
			}

			if (machineId) {
				conditions['machineId'] = machineId
			}

			if (computerName) {
				conditions['computerName'] = computerName
			}

			if (verifySuccess) {
				conditions['verifySuccess'] = verifySuccess
			}

			if (registerSuccess) {
				conditions['registerSuccess'] = registerSuccess
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

			if (idStart || idEnd) {
				conditions['id_machine'] = {}

				if (idStart) {
					conditions.id_machine['$gte'] = idStart
				}
				if (idEnd) {
					conditions.id_machine['$lte'] = idEnd
				}
			}

			const result = await HistoryMachines.find(conditions)
				.sort({ createdAt: 1 })
				.limit(limit ? Number(limit) : null)
				.skip(page ? (Number(page) - 1) * Number(limit) : null)
				.then(async (machines) => {
					const newHistoryMachine = []

					for (let i = 0; i < machines.length; i++) {
						const machine = machines[i]
						await Machines.findOne({
							machineId: machine.machineId,
						}).then((mc) => {
							let newMc = { ...machine }._doc

							if (!mc) {
								newMc.dataMachine = null
							} else {
								newMc.dataMachine = mc
							}

							newHistoryMachine.push(newMc)
						})
					}
					return newHistoryMachine
				})

			const total_count_db = await HistoryMachines.find(conditions)

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

module.exports = historyMachinesCtrl
