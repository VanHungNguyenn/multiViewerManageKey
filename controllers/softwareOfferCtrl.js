const SoftwareOfferModel = require('../models/softwareOfferModel')
const SoftwareModel = require('../models/softwareModel')

const softwareOfferCtrl = {
	addSoftwareOffer: async (req, res) => {
		try {
			const {
				softwareId,
				title,
				price,
				originalPrice,
				discountValue,
				note,
				tag,
				value,
			} = req.body

			if (!softwareId || !title || !price || !value) {
				return res.status(400).json({
					message: 'softwareId, title, price and value are required',
				})
			}

			if (isNaN(softwareId)) {
				return res.status(400).json({
					message: 'softwareId must be a number',
				})
			}

			if (isNaN(price)) {
				return res.status(400).json({
					message: 'Price must be number',
				})
			}

			if (originalPrice && isNaN(originalPrice)) {
				return res.status(400).json({
					message: 'OriginalPrice must be number',
				})
			}

			if (discountValue && isNaN(discountValue)) {
				return res.status(400).json({
					message: 'DiscountValue must be number',
				})
			}

			// value is number
			if (isNaN(value)) {
				return res.status(400).json({
					message: 'Value must be number',
				})
			}

			const software = await SoftwareModel.findOne({ softwareId })

			if (!software) {
				return res.status(400).json({
					message: 'Software does not exist',
				})
			}

			const newSoftwareOffer = new SoftwareOfferModel({
				softwareId,
				title,
				price,
				originalPrice,
				discountValue,
				value,
				note,
				tag,
			})

			await newSoftwareOffer.save()

			res.status(200).json({
				message: 'Add software offer successfully',
			})
		} catch (error) {
			res.status(500).json({
				message: error.message,
			})
		}
	},
	getAllSoftwareOffer: async (req, res) => {
		try {
			const softwareOffers = await SoftwareOfferModel.find()
			const softwares = await SoftwareModel.find()

			const softwaresOfferWithNameProduct = softwareOffers.map(
				(softwareOffer) => {
					const soft = softwares.find(
						(software) =>
							software.softwareId === softwareOffer.softwareId
					)

					const softwareOfferWithNameProduct = {
						...softwareOffer._doc,
						nameProduct: soft.nameProduct,
					}

					return softwareOfferWithNameProduct
				}
			)

			res.status(200).json({
				total: softwaresOfferWithNameProduct.length,
				softwaresOfferWithNameProduct,
				message: 'Get all software offer successfully',
			})
		} catch (error) {
			res.status(500).json({
				message: error.message,
			})
		}
	},
	getSoftwareOfferById: async (req, res) => {
		try {
			const { softwareOfferId } = req.params

			if (!softwareOfferId) {
				return res.status(400).json({
					message: 'Software offer does not exist',
				})
			}

			const softwareOffer = await SoftwareOfferModel.findOne({
				softwareOfferId,
			})

			if (!softwareOffer) {
				return res.status(400).json({
					message: 'Software offer not found',
				})
			}

			const software = await SoftwareModel.findOne({
				softwareId: softwareOffer.softwareId,
			})

			const softwareOfferWithNameProduct = {
				...softwareOffer._doc,
				software: software.nameProduct,
			}

			res.status(200).json({
				message: 'Get software offer successfully',
				softwareOfferWithNameProduct,
			})
		} catch (error) {
			res.status(500).json({
				message: error.message,
			})
		}
	},
	updateSoftwareOffer: async (req, res) => {
		try {
			const { softwareOfferId } = req.params

			const {
				softwareId,
				title,
				price,
				originalPrice,
				discountValue,
				value,
				note,
				tag,
			} = req.body

			if ((!softwareOfferId || !title || !softwareId, !price)) {
				return res.status(400).json({
					message:
						'softwareOfferId, title, softwareId, price are required',
				})
			}

			if (isNaN(softwareId)) {
				return res.status(400).json({
					message: 'softwareId must be a number',
				})
			}

			const software = await SoftwareModel.findOne({
				softwareId,
			})

			if (!software) {
				return res.status(400).json({
					message: 'Software does not exist',
				})
			}

			if (isNaN(price)) {
				return res.status(400).json({
					message: 'Price must be number',
				})
			}

			if (originalPrice && isNaN(originalPrice)) {
				return res.status(400).json({
					message: 'OriginalPrice must be number',
				})
			}

			if (discountValue && isNaN(discountValue)) {
				return res.status(400).json({
					message: 'DiscountValue must be number',
				})
			}

			// value is number
			if (isNaN(value)) {
				return res.status(400).json({
					message: 'Value must be number',
				})
			}

			const updatedSoftwareOffer =
				await SoftwareOfferModel.findByIdAndUpdate(
					softwareOfferId,
					{
						softwareId,
						title,
						price,
						originalPrice,
						discountValue,
						value,
						note,
						tag,
					},
					{ new: true }
				)

			if (!updatedSoftwareOffer) {
				return res.status(400).json({
					message: 'Software offer does not exist',
				})
			}

			return res.status(200).json({
				updatedSoftwareOffer,
				message: 'Software offer updated successfully',
			})
		} catch (error) {
			res.status(500).json({
				message: error.message,
			})
		}
	},
	deleteSoftwareOffer: async (req, res) => {
		try {
			const { softwareOfferId } = req.params

			if (!softwareOfferId) {
				return res.status(400).json({
					message: 'Software offer does not exist',
				})
			}

			const softwareOffer = await SoftwareOfferModel.findByIdAndDelete(
				softwareOfferId
			)

			if (!softwareOffer) {
				return res.status(400).json({
					message: 'Software offer does not exist',
				})
			}

			return res.status(200).json({
				message: 'Software offer deleted successfully',
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
}

module.exports = softwareOfferCtrl
