const AccountsModel = require('../models/accountsModel')

const accountsCtrl = {
	addAccount: async (req, res) => {
		try {
			const { title, api, password } = req.body

			const checkTitle = await AccountsModel.findOne({ title })

			if (checkTitle) {
				return res.status(400).json({
					message: 'Title is exist',
				})
			}

			const newAccount = new AccountsModel({
				title,
				api,
				password,
			})

			await newAccount.save()

			res.status(201).json({
				message: 'Account added successfully',
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
}

module.exports = accountsCtrl
