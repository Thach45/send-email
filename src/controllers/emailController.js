const nodemailer = require('nodemailer');

// Tạo transporter một lần và tái sử dụng
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

exports.sendEmail = async (req, res) => {
  try {
    const { content, recipientEmail } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!content || !recipientEmail) {
      return res.status(400).json({
        success: false,
        error: 'Nội dung email và địa chỉ người nhận là bắt buộc'
      });
    }

    // Kiểm tra kết nối SMTP
    await transporter.verify();

    // Cấu hình email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: 'Tin nhắn mới',
      html: content
    };

    // Gửi email
    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Gửi email thành công',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Lỗi:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Không thể gửi email',
      message: error.message
    });
  }
};
