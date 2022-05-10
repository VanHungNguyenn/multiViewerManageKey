const router = require('express').Router()
const usersCtrl = require('../controllers/usersCtrl')
const auth = require('../middlewares/auth')

router.post('/register', usersCtrl.register)
router.post('/login', usersCtrl.login)
router.post('/refresh_token', usersCtrl.getAccessToken)
router.get('/infor', auth, usersCtrl.getUserInfor)
router.get('/logout', usersCtrl.logout)

module.exports = router
