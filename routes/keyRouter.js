const router = require('express').Router()
const keyCtrl = require('../controllers/keyCtrl')
const auth = require('../middlewares/auth')

// Seller
router.post('/add', auth, keyCtrl.addKey)
router.get('/all', auth, keyCtrl.getAllKey)
router.put('/update/:id', auth, keyCtrl.updateKey)
router.delete('/delete/:id', auth, keyCtrl.deleteKey)

router.get((req, res) => {
	res.status(404).json({ msg: '404: File Not Found' })
})

module.exports = router
