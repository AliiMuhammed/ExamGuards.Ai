const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");
// const mailgunTransport = require("nodemailer-mailgun-transport");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const path = require("path");

// const mailgunOptions = {
//   auth: {
//     api_key: process.env.MAILGUN_API_KEY,
//     domain: process.env.MAILGUN_DOMAIN,
//   },
// };

// const transport = mailgunTransport(mailgunOptions);
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = `Teachable <hello@teachable.io>`;
    // this.emailClient = nodemailer.createTransport(transport);
  }

  newTransport() {
    // if (process.env.NODE_ENV === "production") {
    //   return nodemailer.createTransport(transport);
    // }

    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "Gmail",
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(
      path.join(__dirname, `../views/emails/${template}.pug`),
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the Teachable Family!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)"
    );
  }

  async sendVerified() {
    await this.send("emailVerified", "Your email has been verified");
  }
};
