const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-app-password'     // Replace with your app password
  }
});

app.post('/api/send-otp', async (req, res) => {
  const { to, subject, html } = req.body;

  try {
    await transporter.sendMail({
      from: 'Pet Adoption System <your-email@gmail.com>',
      to: to,
      subject: subject,
      html: html
    });

    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
});