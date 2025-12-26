const ejs = require("ejs");
const path = require("path");
const nodemailer = require("nodemailer");

class MailHelper {
  /**
   * Method: sendMail
   * Purpose: send mail to the user
   * @param {*} data
   * @response {*} send mail to the user
   */
  sendMail = async (data) => {
    try {
      const html = await ejs.renderFile(
        path.join(__dirname, "mailtemplates/emailTemplate.ejs"),
        data
      );
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true, // Use SSL/TLS
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          // Don't reject unauthorized certificates (for self-signed certs)
          rejectUnauthorized: false
        }
      });
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: data.email,
        cc: ["safarwanderlust@gmail.com"],
        subject: "Payment Confirmation",
        html: html,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error("Email sending error:", error);
        }
      });
    } catch (error) {
      console.error("Mail helper error:", error);
      // Don't throw - email failure shouldn't break payment processing
    }
  };
}

module.exports.MailHelper = new MailHelper();