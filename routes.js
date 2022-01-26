const router = require('express').Router();
// declaring routes to be used
const AuthRoutes = require('./components/auth/auth.routes')

// here imported all routes from routes folder
router.use(AuthRoutes)

module.exports = router