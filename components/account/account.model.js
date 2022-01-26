const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const validator = require('validator')
const { hash, compare, genSalt } = require("bcrypt");
// schema of the account
const schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      uniqueCaseInsensitive: true,
      validate: {
        validator: (data) => validator.default.isEmail(data),
        message: (props) => `${props.value} is not a valid email.`,
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
    },
    salt: {
      type: String,
      require: true,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    verificationToken: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// function created in model to handle password check
schema.methods.isValidPassword = async function (password) {
  const account = this;
  const isValid = await compare(password, account.password);
  return isValid;
};

// handling password change and salt generation/hashing password
schema.pre("save", async function (next) {
  var account = this;
  try {
    if (account.isModified("password")) {
      // salt generation, we used 6 rounds
      // the more rounds we set here, the less performance we get in register
      const salt = await genSalt(6);
      const password = await hash(account.password, salt);
      account.password = password;

      next();
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

schema.plugin(uniqueValidator, {
  message: `An account already exists with this email.`,
});
// reflect schema created to db
const Account = model("account", schema);

// for creating index/ensure index created
Account.createIndexes();

module.exports = Account;
