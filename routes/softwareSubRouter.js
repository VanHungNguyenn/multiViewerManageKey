const router = require('express').Router()
const softwareSubCtrl = require('../controllers/softwareSubCtrl')

const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

router.post('/buy', auth, softwareSubCtrl.buySoftwareSub)
router.get('/infor', auth, softwareSubCtrl.getSoftwareSubById)
router.get('/all', auth, authAdmin, softwareSubCtrl.getAllSoftwareSub)

module.exports = router
