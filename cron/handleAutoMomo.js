const axios = require('axios')

const AccountsModel = require('../models/accountsModel')
const HistoryTransactionModel = require('../models/historyTransactionModel')
const HistoryMomoModel = require('../models/historyMomoModel')
const UserModel = require('../models/userModel')

const handleAutoMomo = async () => {
	try {
		const momoInfor = await AccountsModel.findOne({ title: 'momo' })
		const momoAPI = momoInfor.api

		console.log(momoAPI)

		const res = await axios.get(
			`https://api.web2m.com/historyapimomo/${momoAPI}`
		)

		let { tranList } = res.data.momoMsg

		if (!tranList) {
			return
		}

		if (tranList.length === 0) {
			return
		}

		for (let i = 0; i < tranList.length; i++) {
			const { tranId, comment, amount, desc } = tranList[i]

			console.log({ tranId, comment, amount })
		}
	} catch (error) {
		console.log('Momo: ', error.message)
	}
}

module.exports = handleAutoMomo
