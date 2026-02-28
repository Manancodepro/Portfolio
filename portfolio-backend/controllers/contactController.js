const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const Message = require('../models/Message');

// @desc  Handle contact form submission
// @route POST /api/contact
// @access Public
const sendMessage = asyncHandler(async (req, res) => {
    const { name, email, message } = req.body;

    // --- Validation ---
    if (!name || !email || !message) {
        res.status(400);
        throw new Error('Please provide name, email, and message.');
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        res.status(400);
        throw new Error('Please provide a valid email address.');
    }

    if (message.trim().length < 10) {
        res.status(400);
        throw new Error('Message must be at least 10 characters long.');
    }

    // --- Save to MongoDB ---
    const saved = await Message.create({ name, email, message });

    // --- Send email ---
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `📩 New message from ${name}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #fff; border-radius: 12px; padding: 32px;">
        <h2 style="color: #a78bfa; margin-bottom: 8px;">New Portfolio Message</h2>
        <hr style="border-color: #333; margin-bottom: 24px;" />
        <p><strong style="color: #a78bfa;">Name:</strong> ${name}</p>
        <p><strong style="color: #a78bfa;">Email:</strong> <a href="mailto:${email}" style="color: #60a5fa;">${email}</a></p>
        <p><strong style="color: #a78bfa;">Message:</strong></p>
        <div style="background: #1a1a2e; border-left: 4px solid #a78bfa; padding: 16px; border-radius: 8px; margin-top: 8px;">
          <p style="margin: 0; line-height: 1.6;">${message.replace(/\n/g, '<br/>')}</p>
        </div>
        <hr style="border-color: #333; margin-top: 24px;" />
        <p style="color: #666; font-size: 12px;">Received on ${new Date().toLocaleString()}</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (emailError) {
        console.error('Email sending failed:', emailError.message);
        // Still respond with success since the message was saved to DB
    }

    res.status(201).json({
        success: true,
        message: 'Message received! I will get back to you soon.',
        id: saved._id,
    });
});

module.exports = { sendMessage };
