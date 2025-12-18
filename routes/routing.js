const express = require('express')
const deviceController = require('../controllers/deviceController')

const router = new express.Router()

// route for admin to add device
router.post('/admin/addDevice',deviceController.addDevice)

module.exports = router