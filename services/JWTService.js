const keys = require('../config/keys');
const jwt = require('jsonwebtoken');

module.exports = {
    generateToken: (user) => {
        // payload that will be in access token
        const payload = {}

        // encoding method
        const accessToken = jwt.sign(payload, keys.JWTSECRET, {
            algorithm: 'HS256',
            expiresIn: keys.expiresIn
        })
        // what will be returned
        return {
            account: {...payload},
            accessToken
        }
    },

}