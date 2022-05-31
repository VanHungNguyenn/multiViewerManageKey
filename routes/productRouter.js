const router = require('express').Router()
const productCtrl = require('../controllers/productCtrl')

const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

router.post('/create', auth, authAdmin, productCtrl.createNewProduct)
router.get('/all', auth, authAdmin, productCtrl.getAllProducts)
router.put('/update/:id', auth, authAdmin, productCtrl.updateProduct)
router.delete('/delete/:id', auth, authAdmin, productCtrl.deleteProduct)

module.exports = router
