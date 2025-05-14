const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendEmail = async (req, res) => {
  try {
    const { content, recipientEmail } = req.body;

    if (!content || !recipientEmail) {
      return res.status(400).json({ 
        error: 'Nội dung email và địa chỉ người nhận là bắt buộc' 
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: 'Tin nhắn mới',
      text: content
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Gửi email thành công' });
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    res.status(500).json({ error: 'Không thể gửi email' });
  }
};