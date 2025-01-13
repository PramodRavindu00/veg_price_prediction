import nodemailer from "nodemailer";

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
    await transporter.sendMail(mailOptions);
    console.log("Email send successfully");
    
    return true;
  } catch (error) {
    console.error(error.message);
    return false;
  }
};
