const express = require('express')
const router = express.Router()

const{registerUser, loginUser, logout , getUserProfile, updatePassword, updateProfile, allUsers, getUserDetails ,updateUser , deleteUser , forgotPassword , resetPassword} = require('../controllers/authController')

const {isAuthenticatedUser , authorizeRoles} = require('../middlewares/auth')

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.route('/me').get(isAuthenticatedUser , getUserProfile);
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').post(resetPassword)
router.route('/password/update').put(isAuthenticatedUser , updatePassword)
router.route('/me/update').put(isAuthenticatedUser , updateProfile)
router.route('/admin/user/:id').get(isAuthenticatedUser , authorizeRoles('admin'), getUserDetails)
router.route('/admin/update/:id').put(isAuthenticatedUser , authorizeRoles('admin'), updateUser)
router.route('/admin/update/:id').delete(isAuthenticatedUser , authorizeRoles('admin'), deleteUser)


module.exports = router