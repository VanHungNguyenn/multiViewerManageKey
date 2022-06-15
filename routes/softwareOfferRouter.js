const router = require('express').Router()
const softwareOfferCtrl = require('../controllers/softwareOfferCtrl')

const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

router.post('/add', auth, authAdmin, softwareOfferCtrl.addSoftwareOffer)
router.get('/all', auth, authAdmin, softwareOfferCtrl.getAllSoftwareOffer)
router.get(
	'/infor/:softwareOfferId',
	auth,
	authAdmin,
	softwareOfferCtrl.getSoftwareOfferById
)
router.put(
	'/update/:softwareOfferId',
	auth,
	authAdmin,
	softwareOfferCtrl.updateSoftwareOffer
)
router.delete(
	'/delete/:softwareOfferId',
	auth,
	authAdmin,
	softwareOfferCtrl.deleteSoftwareOffer
)

module.exports = router
