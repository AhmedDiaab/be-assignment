// imports
const app = require('./app')
const SETTINGS = require('./config/settings')


// listen to port 
app.listen(SETTINGS.SERVER.PORT, () => {
    console.log(`Server running on port ${SETTINGS.SERVER.PORT}`)
})