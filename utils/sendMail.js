import nodemailer from "nodemailer";
require("dotenv").config({ path: ".env" });

const senderEmail = process.env.SENDER_EMAIL;
const appPassword = process.env.APP_PASSWORD;

const sendMail = async (email, subject, html) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: senderEmail,
      pass: appPassword,
    },
  });
  let mailOptions = {
    to: email,
    from: senderEmail,
    subject: subject,
    html: html,
  };
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    }
    console.log("Email sent: ");
  });
};

export default sendMail;
