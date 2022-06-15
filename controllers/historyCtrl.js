const HistoryTransactionModel = require('../models/historyTransactionModel')
const HistoryMomoModel = require('../models/historyMomoModel')
const HistoryBankModel = require('../models/historyBankModel')

const historyCtrl = {
	getAllHistoryMomo: async (req, res) => {
		try {
			const historyMomo = await HistoryMomoModel.find()
			res.status(200).json({
				message: 'Get all history momo successfully',
				historyMomo,
			})
		} catch (error) {
			res.status(500).json({
				message: error.message,
			})
		}
	},
	getAllHistoryBank: async (req, res) => {
		try {
			const historyBank = await HistoryBankModel.find()
			res.status(200).json({
				message: 'Get all history bank successfully',
				historyBank,
			})
		} catch (error) {
			res.status(500).json({
				message: error.message,
			})
		}
	},
	getAllHistoryTransaction: async (req, res) => {
		try {
			const historyTransaction = await HistoryTransactionModel.find()
			res.status(200).json({
				message: 'Get all history transaction successfully',
				historyTransaction,
			})
		} catch (error) {
			res.status(500).json({
				message: error.message,
			})
		}
	},
}

module.exports = historyCtrl
