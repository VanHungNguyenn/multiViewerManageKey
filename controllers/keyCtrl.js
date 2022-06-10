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
				const user = allUsers.find((user) => user._id === key.idName)
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
				totalKey: keys.length,
				totalPrice: keys.reduce((total, key) => total + key.price, 0),
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	updateKey: async (req, res) => {
		try {
			const { id } = req.params

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

			// check key to update is exist?
			const checkKey = await KeyModel.findById(id)

			if (!checkKey) {
				return res.status(400).json({ message: 'Key is not exist' })
			}

			// check price is number?
			if (!isNumber(price)) {
				return res
					.status(400)
					.json({ message: 'Price must be a number' })
			}

			// update key
			const updateKey = await KeyModel.findByIdAndUpdate(
				id,
				{
					key,
					price,
					idProduct,
					idName,
					note,
					seller,
					expired,
					forever,
				},
				{ new: true }
			)

			return res.status(200).json({
				message: 'Key updated successfully',
				data: updateKey,
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	deleteKey: async (req, res) => {
		try {
			const { id } = req.params

			// delete key
			const deleteKey = await KeyModel.findByIdAndDelete(id)

			if (!deleteKey) {
				return res.status(400).json({ message: 'Key is not exist' })
			}

			return res.status(200).json({
				message: 'Key deleted successfully',
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	getKey: async (req, res) => {
		try {
			const { id } = req.params

			const getKey = await KeyModel.findById(id)

			if (!getKey) {
				return res.status(400).json({ message: 'Key is not exist' })
			}

			// get user and nameProduct
			const user = await UserModel.findById(getKey.idName)
			const nameProduct = await ProductModel.findOne({
				id_product: getKey.idProduct,
			})

			// add user and nameProduct to key
			const key = {
				...getKey._doc,
				name: user ? user._doc.name : null,
				nameProduct: nameProduct ? nameProduct._doc.nameProduct : null,
			}

			return res.status(200).json({
				message: 'Get key successfully',
				key,
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
}

module.exports = keyCtrl
