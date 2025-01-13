const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const whatsappRoutes = require('./routes/whatsappRoutes');

// Load environment variables
dotenv.config();

// Middlewares
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Failed to connect to MongoDB:', err));

// Routes
app.use('/api/whatsapp', whatsappRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
