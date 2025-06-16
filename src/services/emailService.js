const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
   auth: {
    user: process.env.SQUAD_PAY_EMAIL,
    pass: process.env.SQUAD_PAY_EMAIL_PASSWORD,
  },
});

const sendPasswordResetEmail = async (id,email, token) => {
    const resetLink = `${process.env.APP_URL}/reset-password/${id}/${token}`;
  const mailOptions = {
  from: process.env.SQUAD_PAY_EMAIL,
  to: email,
  subject: 'Password Reset',
  html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`,
};

  return transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordResetEmail };
