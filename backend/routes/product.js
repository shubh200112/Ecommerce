const express = require('express')
const router = express.Router()

const {getProducts , newProduct , updateProduct,getSingleProduct, deleteProduct} = require('../controllers/productController')

router.get('/products',getProducts)
router.route('/product/:id').get(getSingleProduct)
router.post('/admin/product/new',newProduct)
router.route('/admin/product/:id').put(() => { updateProduct })
router.delete('/admin/product/:id',deleteProduct)

module.exports = router