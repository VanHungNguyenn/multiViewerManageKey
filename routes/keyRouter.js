const router = require('express').Router()
const keyCtrl = require('../controllers/keyCtrl')
const auth = require('../middlewares/auth')
const authSeller = require('../middlewares/authSeller')

// seller
router.post('/add', auth, authSeller, keyCtrl.addKey)
router.get('/all', auth, authSeller, keyCtrl.getAllKey)
router.put('/update/:id', auth, authSeller, keyCtrl.updateKey)
router.delete('/delete/:id', auth, authSeller, keyCtrl.deleteKey)
router.get('/infor/:id', auth, authSeller, keyCtrl.getKey)

module.exports = router
