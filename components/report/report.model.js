const { Schema, model, Types } = require("mongoose");
const schema = new Schema({
    status: {
        type: String,
        required: true,
        enum: ["Up", "Down"]
    },
    availability: {
        type: Number,
        min:0,
        max: 100,
        required: true
    },
    outages: {
        type: Number,
        required: true
    },
    uptime: {
        type: Number,
        required: true,
        min:0
    },
    responseTime: {
        type: Number,
        min:0
    },
    history: [String]
}, {
    timestamps: true
})

const History = model('history', schema)

module.exports = History