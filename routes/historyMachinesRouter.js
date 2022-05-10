const router = require('express').Router()
const historyMachinesCtrl = require('../controllers/historyMachinesCtrl')
const authKey = require('../middlewares/authKey')
const auth = require('../middlewares/auth')

router.post(
	'/add_history_machine',
	authKey,
	historyMachinesCtrl.addHistoryMachine
)
router.patch('/update/:id', authKey, historyMachinesCtrl.updateHistoryMachine)
router.delete('/delete/:id', authKey, historyMachinesCtrl.deleteMachine)
router.get('/all_info', authKey, historyMachinesCtrl.getHistoryMachinesInfo)
router.get('/info', authKey, historyMachinesCtrl.getInfo)
router.get(function (req, res) {
	res.status(404).json({ msg: '404: File Not Found' })
})

module.exports = router
