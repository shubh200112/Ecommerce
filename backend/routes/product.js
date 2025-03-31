const express = require('express')
const router = express.Router()

const {getProducts , newProduct , updateProduct,getSingleProduct, deleteProduct, createProductReview , getProductReviews , deleteReview} = require('../controllers/productController')

const {isAuthenticatedUser , authorizeRoles} = require('../middlewares/auth')

router.route('/products').get(isAuthenticatedUser,authorizeRoles('admin'),getProducts)
router.route('/product/:id').get(getSingleProduct)

router.post('/admin/product/new',isAuthenticatedUser ,authorizeRoles('admin'),newProduct)
router.route('/admin/product/:id').put(() => { isAuthenticatedUser ,authorizeRoles('admin'),updateProduct })
router.delete('/admin/product/:id',isAuthenticatedUser ,deleteProduct)

router.route('/review').put(isAuthenticatedUser, createProductReview)
router.route('/reviews').get(isAuthenticatedUser, getProductReviews)
router.route('/reviews').delete(isAuthenticatedUser, deleteReview)

module.exports = router