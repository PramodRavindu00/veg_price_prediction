import nodemailer from "nodemailer";
import 'dotenv/config'

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: to,
      subject: subject,
      text: text,
      html: text,
    };
    const mailRes = await transporter.sendMail(mailOptions);
    return mailRes;
  } catch (error) {
    console.error(error.message);
  }
};
