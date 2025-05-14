const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

// Route for sending email
router.post('/send', emailController.sendEmail);

module.exports = router;