const smtpTransport = require("nodemailer-smtp-transport");
const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  })
);

const sendMail = (subject, content, email) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail({
      to: email,
      text: content,
      html: content,
      subject: subject
    })
    .then(data => {
        resolve(data)
    })
    .catch(err => {
        reject(err)
    })
  });
};

module.exports = {
    sendMail
}
