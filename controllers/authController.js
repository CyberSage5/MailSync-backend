const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// User Signup
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpires,
        });

        // Save the user and log the token & expiration for debugging
        await newUser.save();
        console.log('Token:', verificationToken);
        console.log('Expires at:', new Date(verificationTokenExpires).toLocaleString());

        // Send verification email
        const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email/${verificationToken}`;
        
        // Set up the email transporter (using Gmail as an example)
        const transporter = nodemailer.createTransport({
            service: 'Gmail',  // or 'smtp.mailtrap.io' for testing purposes
            auth: {
                user: process.env.EMAIL_USER, // email user (from .env)
                pass: process.env.EMAIL_PASS, // email password (from .env)
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,  // sender email (from .env)
            to: email,                     // recipient email (user's email)
            subject: 'Verify Your Email',  // email subject
            html: `<p>Hi ${name},</p>
                   <p>Thank you for signing up. Please click the link below to verify your email:</p>
                   <a href="${verificationLink}">Verify Email</a>
                   <p>This link will expire in 24 hours.</p>`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        // Response after successful signup
        res.status(201).json({
            message: 'Signup successful. Please check your email to verify your account.',
        });
    } catch (error) {
        console.error(error);  // Log error for easier debugging
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// Email Verification
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        console.log('Token received for verification:', token);

        // Find the user with the token
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        // Verify the user
        user.isVerified = true;
        user.verificationToken = undefined; // Clean up the token after successful verification
        user.verificationTokenExpires = undefined; // Clean up the expiration time
        await user.save();

        res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
        console.error(error);  // Log error for easier debugging
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// User Login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email before logging in.' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ message: 'Login successful.', token, user });
    } catch (error) {
        console.error(error);  // Log error for easier debugging
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};
