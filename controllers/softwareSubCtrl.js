const SoftwareSubModel = require('../models/softwareSubModel')
const UserModel = require('../models/userModel')
const SoftwareModel = require('../models/softwareModel')
const HistorySubModel = require('../models/historySubModel')

const softwareSubCtrl = {
	buySoftwareSub: async (req, res) => {
		try {
			const { softwareId } = req.params

			const { userId, title, value, price } = req.body

			if (!userId || !title || !value || !price) {
				return res.status(400).json({
					message: 'userId, title, value and price are required',
				})
			}

			const user = await UserModel.findOne({ userId })

			if (!user) {
				return res.status(400).json({
					message: 'User does not exist',
				})
			}

			const software = await SoftwareModel.findOne({ softwareId })

			if (!software) {
				return res.status(400).json({
					message: 'Software does not exist',
				})
			}

			if (user.balance < parseInt(price)) {
				return res.status(400).json({
					message: 'User has not enough balance',
				})
			}

			const softwareSub = await SoftwareSubModel.findOne({
				softwareId,
				userId,
			})

			if (softwareSub) {
				const expDate = softwareSub
				let newExpDate

				if (expDate < Date.now()) {
					newExpDate = new Date(
						Date.now() + value * 24 * 60 * 60 * 1000
					)
				} else {
					newExpDate = new Date(
						expDate.getTime() + value * 24 * 60 * 60 * 1000
					)
				}

				await SoftwareSubModel.findByIdAndUpdate(softwareSub._id, {
					expDate: newExpDate,
				})
			} else {
				const newSoftwareSub = new SoftwareSubModel({
					softwareId,
					userId,
					expDate: new Date(Date.now() + value * 24 * 60 * 60 * 1000),
				})

				await newSoftwareSub.save()
			}

			const newHistorySub = new HistorySubModel({
				nameUser: user.name,
				nameProduct: software.nameProduct,
				title,
				price,
			})

			await newHistorySub.save()

			// update balance
			const newBalance = user.balance - parseInt(price)

			await UserModel.findOneAndUpdate(
				{ userId },
				{
					balance: newBalance,
				}
			)

			return res.status(200).json({
				message: 'Buy success',
			})
		} catch (error) {
			return res.status(500).json({
				message: error.message,
			})
		}
	},
	getSoftwareSubById: async (req, res) => {
		try {
			const { id } = req.user

			const user = await UserModel.findById(id)

			if (!user) {
				return res.status(400).json({
					message: 'User not found',
				})
			}

			const softwareSubs = await SoftwareSubModel.find({
				userId: user.userId,
			})

			if (!softwareSubs) {
				return res.status(400).json({
					message: 'Softwares not found',
				})
			}

			const softwares = await SoftwareModel.find()

			const softwareSubsWithNameSoftware = softwareSubs.map(
				(softwareSub) => {
					const software = softwares.find(
						(software) =>
							software.softwareId === softwareSub.softwareId
					)

					return {
						...softwareSub._doc,
						nameSoftware: software.nameProduct,
					}
				}
			)

			return res.status(200).json({
				softwareSubsWithNameSoftware,
				message: 'Successfully get softwares',
			})
		} catch (error) {
			return res.status(500).json({
				message: error.message,
			})
		}
	},
	getAllSoftwareSub: async (req, res) => {
		try {
			const softwareSubs = await SoftwareSubModel.find()

			const softwares = await SoftwareModel.find()
			const users = await UserModel.find()

			const softwareSubsWithNameSoftware = softwareSubs.map(
				(softwareSub) => {
					const software = softwares.find(
						(software) =>
							software.softwareId === softwareSub.softwareId
					)

					const user = users.find(
						(user) => user.userId === softwareSub.userId
					)

					return {
						...softwareSub._doc,
						nameSoftware: software.nameProduct,
						nameUser: user.name,
					}
				}
			)

			return res.status(200).json({
				total: softwareSubsWithNameSoftware.length,
				softwareSubsWithNameSoftware,
				message: 'Successfully get softwares',
			})
		} catch (error) {
			return res.status(500).json({
				message: error.message,
			})
		}
	},
}

module.exports = softwareSubCtrl
