const mongoose = require('mongoose')
// function used to connect to database
const connect = (url) => {
    mongoose.connect(url,()=> {
        console.log(`Database connected with url ${url}`)
    })
}

module.exports = {connect}