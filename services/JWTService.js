const jwt = require('jsonwebtoken');

module.exports = {
    generateToken: (user) => {
        // payload that will be in access token
        const payload = {
            _id: user._id,
            email: user.email,
            verified: user.verified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
        // encoding method
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: process.env.JWT_EXPIRATION
        })
        // what will be returned
        return {
            account: {...payload},
            accessToken
        }
    },

}