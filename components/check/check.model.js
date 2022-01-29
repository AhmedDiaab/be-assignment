const { Schema, model, Types } = require("mongoose");
const validator = require("validator");

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    url: {
      type: String,
      required: true,
      validate: {
        validator: (data) => validator.default.isURL(data),
        message: (props) => `${props.value} is not a valid url.`,
      },
    },
    protocol: {
      type: String,
      required: true,
      enum: ["HTTP", "HTTPS", "TCP"],
    },
    port: {
      type: Number,
    },
    webhook: {
      type: String,
      required: false,
      validate: {
        validator: (data) => validator.default.isURL(data),
        message: (props) => `${props.value} is not a valid url.`,
      },
    },
    timeout: {
      type: Number,
      required: false,
      default: 5,
    },
    interval: {
      type: Number,
      required: false,
      default: 10 * 60 * 60,
    },
    threshold: {
      type: Number,
      required: false,
      default: 1,
    },
    authentication: {
      // auth schema that can be used when webhook used

      username: {
        type: String,
      },
      password: {
        type: String,
      },
    },
    assert: {
      // assert schema that can be used when asserting status code (used in polling response)
      statusCode: {
        type: Number,
      },
    },
    tags: {
      type: [String],
      required: false,
    },
    ignoreSSL: {
      type: Boolean,
      required: false,
    },
    // reference to user
    account: {
      type: Types.ObjectId,
    },
    progress: {
      type: Types.ObjectId,
      ref: 'progress'
    },
  },
  { timestamps: true }
);

const Check = model("check", schema);

module.exports = Check;
