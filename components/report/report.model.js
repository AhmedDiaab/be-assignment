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
    downtime: {
        type: Number,
        min: 0
    },
    availability: {
        type: Number,
        min:0,
        max: 100,
    },
    outages: {
        type: Number,
    },
    uptime: {
        type: Number,
        min:0,
    },
    responseTime: {
        type: Number,
        min:0
    },
    history: [String],
    tags: [String]
}, {
    timestamps: true
})

const Report = model('report', schema)

module.exports = Report