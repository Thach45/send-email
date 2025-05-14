const nodemailer = require('nodemailer');

// Tạo transporter với cấu hình nâng cao
const createTransporter = () => {
  console.log('Creating mail transporter...');
  console.log('Email User:', process.env.EMAIL_USER); // Log để debug
  
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false
    },
    debug: true // Bật chế độ debug
  });
};

exports.sendEmail = async (req, res) => {
  console.log('Received email request:', {
    recipient: req.body.recipientEmail,
    hasContent: !!req.body.content
  });

  try {
    const { content, recipientEmail } = req.body;

    if (!content || !recipientEmail) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        error: 'Nội dung email và địa chỉ người nhận là bắt buộc' 
      });
    }

    // Tạo transporter mới cho mỗi request
    const transporter = createTransporter();

    // Verify transporter connection
    try {
      await transporter.verify();
      console.log('Transporter verified successfully');
    } catch (verifyError) {
      console.error('Transporter verification failed:', verifyError);
      throw new Error('Mail server connection failed');
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: 'Tin nhắn mới',
      text: content
    };

    console.log('Attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    res.status(200).json({ 
      message: 'Gửi email thành công',
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('Chi tiết lỗi khi gửi email:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      command: error.command
    });

    res.status(500).json({ 
      error: 'Không thể gửi email',
      details: error.message 
    });
  }
};