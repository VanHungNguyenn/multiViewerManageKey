const router = require('express').Router()
const keyCtrl = require('../controllers/keyCtrl')
const auth = require('../middlewares/auth')
const authSeller = require('../middlewares/authSeller')

// seller
router.post('/add', auth, authSeller, keyCtrl.addKey)
router.get('/all', auth, authSeller, keyCtrl.getAllKey)
// router.put('/update/:id', auth, keyCtrl.updateKey)
// router.delete('/delete/:id', auth, keyCtrl.deleteKey)
// router.get('/get_key/:id', auth, keyCtrl.getKey)
// router.get('/all_infor', auth, keyCtrl.getAllInfor)

module.exports = router
