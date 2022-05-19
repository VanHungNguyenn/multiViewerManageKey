const router = require('express').Router()
const { route } = require('express/lib/application')
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

// All
router.post('/register', userCtrl.register)
router.post('/login', userCtrl.login)
// Seller
router.get('/logout', auth, userCtrl.logout)
router.get('/infor', auth, userCtrl.getInfor)

// Admin
router.get('/all_infor', auth, authAdmin, userCtrl.getAllInfor)

router.post('/create', auth, authAdmin, userCtrl.create)
router.put('/update/:id', auth, authAdmin, userCtrl.updateUser)
router.delete('/delete/:id', auth, authAdmin, userCtrl.deleteUser)
router.get('/infor/:id', auth, authAdmin, userCtrl.getInforById)

module.exports = router
