const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
    check: {
        type: Types.ObjectId,
        ref: 'check',
        required: true
    },
    progress: {
        type: Number,
        required: true,
        default: 0
    },
    status:{
        type: String,
        default: "Stopped",
        enum: ["Stopped", "Running"]
    },
},{
    timestamps: true
})

const Progress = model('progress', schema)

module.exports = Progress