const SoftwareModel = require('../models/softwareModel')
const { validateLinkUrl } = require('../utils')

const softwareCtrl = {
	addSoftware: async (req, res) => {
		try {
			const { softwareId, nameProduct, desc, imgUrl, note, tag } =
				req.body

			if (!softwareId || !nameProduct) {
				return res.status(400).json({
					message: 'Missing required fields',
				})
			}

			if (imgUrl && !validateLinkUrl(imgUrl)) {
				return res.status(400).json({
					message: 'Invalid imgUrl',
				})
			}

			if (isNaN(softwareId)) {
				return res.status(400).json({
					message: 'softwareId must be a number',
				})
			}

			const software = await SoftwareModel.findOne({ softwareId })

			if (software) {
				return res.status(400).json({
					message: 'Software already exists',
				})
			}

			const newSoftware = new SoftwareModel({
				softwareId,
				nameProduct,
				desc,
				imgUrl,
				note,
				tag,
			})

			await newSoftware.save()

			res.status(200).json({
				message: 'Add software successfully',
			})
		} catch (error) {
			res.status(500).json({
				message: error.message,
			})
		}
	},
	getAllSoftware: async (req, res) => {
		try {
			const softwares = await SoftwareModel.find()

			res.status(200).json({
				message: 'Get all software successfully',
				softwares,
			})
		} catch (error) {
			res.status(500).json({
				message: error.message,
			})
		}
	},
	getSoftwareById: async (req, res) => {
		try {
			const { softwareId } = req.params

			if (!softwareId) {
				return res.status(400).json({
					message: 'Missing required fields',
				})
			}

			if (isNaN(softwareId)) {
				return res.status(400).json({
					message: 'softwareId must be a number',
				})
			}

			const software = await SoftwareModel.findOne({ softwareId })

			if (!software) {
				return res.status(400).json({
					message: 'Software not found',
				})
			}

			res.status(200).json({
				message: 'Get software successfully',
				software,
			})
		} catch (error) {
			res.status(500).json({
				message: error.message,
			})
		}
	},
	updateSoftware: async (req, res) => {
		try {
			const { softwareId } = req.params

			const { nameProduct, desc, imgUrl, note, tag } = req.body

			if (!softwareId || !nameProduct) {
				return res.status(400).json({
					message: 'softwareId and nameProduct are required',
				})
			}

			if (isNaN(softwareId)) {
				return res.status(400).json({
					message: 'softwareId must be a number',
				})
			}

			if (imgUrl && !validateLinkUrl(imgUrl)) {
				return res.status(400).json({
					message: 'Invalid imgUrl',
				})
			}

			const software = await SoftwareModel.findOne({ softwareId })

			if (!software) {
				return res.status(400).json({
					message: 'Software not found',
				})
			}

			const newSoftware = await SoftwareModel.findOneAndUpdate(
				{ softwareId },
				{
					nameProduct,
					desc,
					imgUrl,
					note,
					tag,
				},
				{
					new: true,
				}
			)

			res.status(200).json({
				message: 'Update software successfully',
				newSoftware,
			})
		} catch (error) {
			res.status(500).json({
				message: error.message,
			})
		}
	},
	deleteSoftware: async (req, res) => {
		try {
			const { softwareId } = req.params

			if (!softwareId) {
				return res.status(400).json({
					message: 'softwareId is required',
				})
			}

			if (isNaN(softwareId)) {
				return res.status(400).json({
					message: 'softwareId must be a number',
				})
			}

			const software = await SoftwareModel.findOne({ softwareId })

			if (!software) {
				return res.status(400).json({
					message: 'Software not found',
				})
			}

			await SoftwareModel.findOneAndDelete({ softwareId })

			res.status(200).json({
				message: 'Delete software successfully',
			})
		} catch (error) {
			res.status(500).json({
				message: error.message,
			})
		}
	},
}

module.exports = softwareCtrl
