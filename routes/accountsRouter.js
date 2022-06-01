const router = require('express').Router()
const accountsCtrl = require('../controllers/accountsCtrl')

const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

router.post('/add', auth, authAdmin, accountsCtrl.addAccount)

module.exports = router
