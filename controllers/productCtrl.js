const ProductModel = require('../models/productModel')
const { isNumber } = require('../utils')

const productCtrl = {
	createNewProduct: async (req, res) => {
		try {
			const { nameProduct, price, desc } = req.body

			if (!nameProduct || !price) {
				return res.status(400).json({
					message: 'Name and price are required',
				})
			}

			if (!isNumber(price)) {
				return res.status(400).json({
					message: 'Price must be a number',
				})
			}

			const productExist = await ProductModel.findOne({ nameProduct })

			if (productExist) {
				return res.status(400).json({
					message: 'Product already exist',
				})
			}

			const newProduct = new ProductModel({
				nameProduct,
				price,
				desc,
			})

			await newProduct.save()

			return res.status(200).json({
				message: 'Product created',
				product: newProduct,
			})
		} catch (error) {
			res.status(500).json({
				message: error.message,
			})
		}
	},
}

module.exports = productCtrl
