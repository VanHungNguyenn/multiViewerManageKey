const axios = require('axios')

const AccountsModel = require('../models/accountsModel')
const HistoryTransactionModel = require('../models/historyTransactionModel')
const HistoryMomoModel = require('../models/historyMomoModel')
const UserModel = require('../models/userModel')

const handleAutoMomo = async () => {
	try {
		const key = 'tk24h'

		const momoInfor = await AccountsModel.findOne({ title: 'momo' })
		const momoAPI = momoInfor.api

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
			let { tranId, comment, amount, desc } = tranList[i]
			comment = comment.trim().toLowerCase()

			if (desc === 'Thành công') {
				const transactionMomo = await HistoryMomoModel.findOne({
					id: tranId,
				})

				// Check if transaction is exist, skip and run loop next
				if (transactionMomo) {
					continue
				}

				// not key
				console.log({ comment })

				if (comment.split(' ')[0] !== key) {
					console.log(comment)

					const newHistoryMomo = new HistoryMomoModel({
						id: tranId,
						amount,
						status: `not ${key}`,
						comment,
					})

					await newHistoryMomo.save()
				} else {
					// not key + name
					if (comment.split(' ').length !== 2) {
						const newHistoryMomo = new HistoryMomoModel({
							id: tranId,
							amount,
							status: `${key}, wrong syntax`,
							comment,
						})

						await newHistoryMomo.save()
					} else {
						const name = comment.split(' ')[1]

						const user = await UserModel.findOne({ name })

						if (!user) {
							const newHistoryMomo = new HistoryMomoModel({
								id: tranId,
								amount,
								status: `${key}, not name`,
								comment,
							})

							await newHistoryMomo.save()
						} else {
							const newHistoryMomo = new HistoryMomoModel({
								id: tranId,
								amount,
								status: `${key}`,
								comment,
								nameUser: name,
							})

							await newHistoryMomo.save()

							const newHistoryTransaction =
								new HistoryTransactionModel({
									nameUser: name,
									amount,
									note: 'momo',
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
		console.log('Momo: ', error.message)
	}
}

module.exports = handleAutoMomo
