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

        // Save the user to the database
        await newUser.save();

        // Send verification email
        const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email/${verificationToken}`;

        // Set up the email transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Email',
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
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// Email Verification
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        // Find the user with the token and ensure it has not expired
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        // Verify the user
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
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

        // Ensure user is verified before allowing login
        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email before logging in.' });
        }

        // Compare password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Respond with login success and token
        res.json({ message: 'Login successful.', token, user });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};
