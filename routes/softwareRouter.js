const router = require('express').Router()
const softwareCtrl = require('../controllers/softwareCtrl')

const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

router.post('/add', auth, authAdmin, softwareCtrl.addSoftware)
router.get('/all', auth, authAdmin, softwareCtrl.getAllSoftware)
router.get('/infor/:softwareId', auth, authAdmin, softwareCtrl.getSoftwareById)
router.put('/update/:softwareId', auth, authAdmin, softwareCtrl.updateSoftware)
router.delete(
	'/delete/:softwareId',
	auth,
	authAdmin,
	softwareCtrl.deleteSoftware
)

module.exports = router
