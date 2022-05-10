const router = require('express').Router()
const infoMachineCtrl = require('../controllers/infoMachineCtrl')

router.post('/add_info', infoMachineCtrl.addInfo)
router.patch('/update/:machineId', infoMachineCtrl.updateInfo)
router.get('/delete/:machineId', infoMachineCtrl.deleteInfo)
router.get('/info', infoMachineCtrl.getInfo)
router.get((req, res, next) => {
	res.status(404).json({ msg: '404: File Not Found' })
})

module.exports = router
