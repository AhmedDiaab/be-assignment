const router = require('express').Router();
// declaring routes to be used
const AuthRoutes = require('./components/auth/auth.routes')
const AccountRoutes = require('./components/account/account.routes')
const CheckRoutes = require('./components/check/check.routes')

// here imported all routes from routes folder
router.use(AuthRoutes)
router.use(AccountRoutes)
router.use(CheckRoutes)

module.exports = router