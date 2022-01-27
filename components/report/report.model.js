const { Schema, model, Types } = require("mongoose");
const schema = new Schema({
    account: {
        type: Types.ObjectId,
        ref: 'account',
        required: true
    },
    check: {
        type: Types.ObjectId,
        ref: 'check',
        required: true
    },
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

const Report = model('report', schema)

module.exports = Report