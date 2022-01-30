const mongoose = require('mongoose')
// function used to connect to database
const connect = (url) => {
    if(process.env.NODE_ENV == "development") {
        mongoose.connect(url,()=> {
            console.log(`Database connected with url ${url}`)
        })
    }
}

module.exports = {connect}