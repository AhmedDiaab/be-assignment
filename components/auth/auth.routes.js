const AuthController = require('./auth.controller')
const router = require('express').Router()

router.post('/register', AuthController.Register);
router.post('/Login', AuthController.Login)

module.exports = router