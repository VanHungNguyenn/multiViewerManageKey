const HistorySubModel = require('../models/historySubModel')

const historySubCtrl = {
	getHistorySubByName: async (req, res) => {
		try {
			const { name } = req.user

			const softwares = await HistorySubModel.find({ nameUser: name })

			return res.status(200).json({
				total: softwares.length,
				softwares,
				message: 'Successfully get softwares',
			})
		} catch (error) {
			return res.status(500).json({
				message: error.message,
			})
		}
	},
	getAllHistorySub: async (req, res) => {
		try {
			const historySubcription = await HistorySubModel.find()

			return res.status(200).json({
				total: historySubcription.length,
				historySubcription,
				message: 'Successfully get historySubcription',
			})
		} catch (error) {
			return res.status(500).json({
				message: error.message,
			})
		}
	},
}

module.exports = historySubCtrl
