const router = require('express').Router()
const historySubCtrl = require('../controllers/historySubCtrl')

const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

router.get('/infor', auth, historySubCtrl.getHistorySubByName)
router.get('/all', auth, authAdmin, historySubCtrl.getAllHistorySub)

module.exports = router
