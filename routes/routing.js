const express = require('express')
const userController = require('../controllers/userController')
const deviceController = require('../controllers/deviceController')
const adminMiddleware = require('../middlewares/adminMiddleware')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const router = new express.Router()

// register user
router.post('/register',adminMiddleware,userController.registerController)

// login user
router.post('/login',userController.loginController)

// all users
router.get('/allusers',adminMiddleware,userController.getAllUserController)

// route for admin to add device
router.post('/admin/addDevice',adminMiddleware,deviceController.addDeviceController)

// route for all device details
router.get('/admin/alldevice',adminMiddleware,deviceController.getAllDeviceAdminController)

// approve device
router.put('/admin/approve/:id',adminMiddleware,deviceController.updateApprovalController)

// disable device
router.put('/admin/disable/:id',adminMiddleware,deviceController.disableApprovalController)

// delete device
router.delete('/admin/delete/:id',adminMiddleware,deviceController.deleteDeviceController)

// all users with assigned device
router.get('/admin/assignedUsers',adminMiddleware,userController.UserController)

// admin details
router.get('/admin/profile',adminMiddleware,userController.adminDetailsController)

// recent alerts
router.get('/admin/recentalerts',adminMiddleware, deviceController.getRecentAlertController)

// all alerts
router.get('/admin/allalerts',adminMiddleware, deviceController.getAllAlertController)

// get all device (device-simulator)
router.get('/devices',deviceController.getAllDevicesController)

// fakedevice config route
router.get('/device/config/:deviceID',deviceController.getDeviceConfigController)

// get logined user device details
router.get('/user/device',jwtMiddleware,deviceController.getLoginUserDeviceDetails)

// 
router.get('/device/:id',jwtMiddleware,deviceController.singleDeviceDetailscontroller)

// get metrics
router.get('/metrics/:id',jwtMiddleware,deviceController.getMetricsController)

// get recentalerts user
router.get('/user/recentalerts',jwtMiddleware,deviceController.getUserRecentAlertController)

// get allalerts user
router.get('/user/allalerts',jwtMiddleware,deviceController.getUserAllAlertController)

// update alert status
router.put('/user/alert/:id',jwtMiddleware,deviceController.updateAlertStatusController)

router.put('/user/updatepassword',jwtMiddleware,userController.updatePasswordController)


module.exports = router