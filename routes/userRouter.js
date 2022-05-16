const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

// All
router.post('/register', userCtrl.register)
router.post('/login', userCtrl.login)
router.post('/refresh_token', userCtrl.getRefreshToken)
// Seller
router.get('/logout', auth, userCtrl.logout)
router.get('/infor', auth, userCtrl.getInfor)
// Admin
router.get('/all_infor', auth, authAdmin, userCtrl.getAllInfor)
router.post('/create', auth, authAdmin, userCtrl.create)
router.post('/update_user/:id', auth, authAdmin, userCtrl.updateUser)
router.delete('/delete_user/:id', auth, authAdmin, userCtrl.deleteUser)

module.exports = router
