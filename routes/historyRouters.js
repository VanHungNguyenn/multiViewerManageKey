const router = require('express').Router()
const historyCtrl = require('../controllers/historyCtrl')

const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

router.get('/momo', auth, authAdmin, historyCtrl.getAllHistoryMomo)
router.get('/bank', auth, authAdmin, historyCtrl.getAllHistoryBank)
router.get(
	'/transaction',
	auth,
	authAdmin,
	historyCtrl.getAllHistoryTransaction
)

module.exports = router
