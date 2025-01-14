require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');

// Use routes
app.use('/api/auth', authRoutes); // Auth routes
app.use('/api/whatsapp', whatsappRoutes); // WhatsApp routes

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
