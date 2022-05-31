const KeyModel = require('../models/keyModel')
const ProductModel = require('../models/productModel')
const UserModel = require('../models/userModel')
const { isNumber } = require('../utils')

const keyCtrl = {
	addKey: async (req, res) => {
		try {
			const {
				key,
				price,
				idProduct,
				idName,
				note,
				seller,
				expired,
				forever,
			} = req.body
			// validate
			if (!key || !price || !idProduct || !expired) {
				return res.status(400).json({
					message: 'Key, price, expired and idProduct are required!',
				})
			}
			// check price is number?
			if (!isNumber(price)) {
				return res
					.status(400)
					.json({ message: 'Price must be a number' })
			}

			// check key is unique?
			const checkKey = await KeyModel.findOne({ key })
			if (checkKey) {
				return res.status(400).json({ message: 'Key is already exist' })
			}

			// create key
			const keyModel = new KeyModel({
				key,
				price,
				idProduct,
				idName,
				note,
				seller,
				expired,
				forever,
			})

			const newKey = await keyModel.save()

			return res.status(200).json({
				message: 'Key created successfully',
				data: newKey,
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	getAllKey: async (req, res) => {
		try {
			const allKeys = await KeyModel.find()

			const allUsers = await UserModel.find()
			const allProducts = await ProductModel.find()

			const keys = allKeys.map((key) => {
				const user = allUsers.find(
					(user) => user.id_user === key.idName
				)
				const product = allProducts.find(
					(product) => product.id_product === key.idProduct
				)

				return {
					...key._doc,
					name: user ? user._doc.name : null,
					nameProduct: product ? product._doc.nameProduct : null,
				}
			})

			return res.status(200).json({
				message: 'Get all key successfully',
				data: keys,
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	// updateKey: async (req, res) => {
	// 	try {
	// 		const { id } = req.params
	// 		const { key, note, expired, forever, price } = req.body
	// 		// validate
	// 		if (!key || !expired) {
	// 			return res
	// 				.status(400)
	// 				.json({ message: 'Please fill in all fields' })
	// 		}

	// 		await KeyModel.findByIdAndUpdate(id, {
	// 			key,
	// 			note,
	// 			expired,
	// 			forever,
	// 			price,
	// 		}).then(() => {
	// 			res.status(200).json({ message: 'Key updated' })
	// 		})
	// 	} catch (error) {
	// 		return res.status(500).json({ message: error.message })
	// 	}
	// },
	// deleteKey: async (req, res) => {
	// 	try {
	// 		const { id } = req.params

	// 		await KeyModel.findByIdAndDelete(id).then(() => {
	// 			res.status(200).json({ message: 'Key deleted' })
	// 		})
	// 	} catch (error) {
	// 		return res.status(500).json({ message: error.message })
	// 	}
	// },
	// getKey: async (req, res) => {
	// 	try {
	// 		const { id } = req.params

	// 		await KeyModel.findById(id).then((key) => {
	// 			res.status(200).json(key)
	// 		})
	// 	} catch (error) {
	// 		return res.status(500).json({ message: error.message })
	// 	}
	// },
	// getAllInfor: async (req, res) => {
	// 	try {
	// 		const keys = await KeyModel.find()
	// 		const totalPrice = keys.reduce((acc, key) => {
	// 			return acc + key.price
	// 		}, 0)

	// 		const totalKey = keys.length

	// 		res.status(200).json({ totalKey, totalPrice })
	// 	} catch (error) {
	// 		return res.status(500).json({ message: error.message })
	// 	}
	// },
}

module.exports = keyCtrl
