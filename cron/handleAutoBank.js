const axios = require('axios')

const AccountsModel = require('../models/accountsModel')
const HistoryTransactionModel = require('../models/historyTransactionModel')
const HistoryBankModel = require('../models/historyBankModel')
const UserModel = require('../models/userModel')

const handleAutoBank = async () => {
	try {
		const key = 'tk24h'

		const bankInfor = await AccountsModel.findOne({ title: 'techcombank' })
		const bankAPI = bankInfor.api
		const password = bankInfor.password
		const cardNumber = process.env.CARD_NUMBER

		const res = await axios.get(
			`https://api.web2m.com/historyapitcbv3/${password}/${cardNumber}/${bankAPI}`
		)

		let { transactions } = res.data

		if (!transactions) {
			return
		}

		if (transactions.length === 0) {
			return
		}

		for (let i = 0; i < transactions.length; i++) {
			let { transactionID, amount, description, type } = transactions[i]

			if (type === 'IN') {
				const transactionBank = await HistoryBankModel.findOne({
					id: transactionID,
				})

				// Check if transaction is exist, skip and run loop next
				if (transactionBank) {
					continue
				}

				// not key
				const comment = handleDescription(description, key)
				amount = parseInt(amount)

				if (comment.split(/[\s,]+/)[0] !== key) {
					const newHistoryBank = new HistoryBankModel({
						id: transactionID,
						amount,
						status: `not ${key}`,
						comment,
					})

					await newHistoryBank.save()
				} else {
					// not key + name
					if (comment.split(/[\s,]+/).length !== 2) {
						const newHistoryBank = new HistoryBankModel({
							id: transactionID,
							amount,
							status: `${key}, wrong syntax`,
							comment,
						})

						await newHistoryBank.save()
					} else {
						const name = comment.split(/[\s,]+/)[1]

						const user = await UserModel.findOne({ name })

						if (!user) {
							const newHistoryBank = new HistoryBankModel({
								id: transactionID,
								amount,
								status: `${key}, not name`,
								comment,
							})

							await newHistoryBank.save()
						} else {
							const newHistoryBank = new HistoryBankModel({
								id: transactionID,
								amount,
								status: `${key}`,
								comment,
								nameUser: name,
							})

							await newHistoryBank.save()

							const newHistoryTransaction =
								new HistoryTransactionModel({
									nameUser: name,
									amount,
									note: 'techcombank',
									comment,
								})

							await newHistoryTransaction.save()

							// update balance and totalDeposit user
							const balance = user.balance + amount
							const totalDeposit = user.totalDeposit + amount

							await UserModel.updateOne(
								{ name },
								{
									$set: {
										balance,
										totalDeposit,
									},
								}
							)
						}
					}
				}
			}
		}
	} catch (error) {
		console.log('Bank: ', error.message)
	}
}

const handleDescription = (description, key) => {
	const lowerText = description.toLowerCase().split(/[/]+/)[0].trim()

	if (lowerText.includes(key)) {
		const rawName = lowerText.split(key)[1].trim()
		const simpleName = rawName
			.split('.')[0]
			.split(':')[0]
			.split('-')[0]
			.split('/')[0]
		const finalName = simpleName.replace(' ', '').trim()

		return `${key} ${finalName}`
	}

	return lowerText
}

module.exports = handleAutoBank
