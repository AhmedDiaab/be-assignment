// imports
const app = require('./app')
const SETTINGS = require('./config/settings')
const DatabaseService = require('./services/DbService')
const DatabaseConfig = require('./config/settings')

// database connection
DatabaseService.connect(DatabaseConfig.DATABASE.URL)

// listen to port 
app.listen(SETTINGS.SERVER.PORT, () => {
    console.log(`Server running on port ${SETTINGS.SERVER.PORT}`)
})