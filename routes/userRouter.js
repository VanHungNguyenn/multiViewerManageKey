const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

// All
router.post('/register', userCtrl.register)
router.post('/login', userCtrl.login)

//user
router.get('/profile', auth, userCtrl.getProfile)
router.get('/history_recharge', auth, userCtrl.getHistoryRecharge)
//admin
router.get('/all', auth, authAdmin, userCtrl.getAllInfor)
router.post('/create', auth, authAdmin, userCtrl.createNewUser)
router.put('/update/:id', auth, authAdmin, userCtrl.updateUser)
router.delete('/delete/:id', auth, authAdmin, userCtrl.deleteUser)
router.get('/profile/:id', auth, authAdmin, userCtrl.getProfileById)
router.put('/change_balance/:id', auth, authAdmin, userCtrl.changeBalance)

module.exports = router
