const router = require('express').Router()
const keyCtrl = require('../controllers/keyCtrl')

router.post('/add', keyCtrl.addKey)
router.get('/all', keyCtrl.getAllKey)
router.put('/update/:id', keyCtrl.updateKey)
router.delete('/delete/:id', keyCtrl.deleteKey)

router.get((req, res) => {
	res.status(404).json({ msg: '404: File Not Found' })
})

module.exports = router
