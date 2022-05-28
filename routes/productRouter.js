const router = require('express').Router()
const productCtrl = require('../controllers/productCtrl')

const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

router.post('/create', auth, authAdmin, productCtrl.createNewProduct)

module.exports = router
