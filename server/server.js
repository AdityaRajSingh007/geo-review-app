const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env file in the server directory
const envPath = path.resolve(__dirname, './.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  // Fallback to default behavior
  require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('ERROR: MONGODB_URI environment variable is not defined!');
  console.error('Please check your .env file contains the MONGODB_URI variable.');
  process.exit(1);
}

console.log('Attempting to connect to MongoDB with URI:', '***HIDDEN_URI***');

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully!'))
.catch(err => console.error('MongoDB connection error:', err));

// Import routes
const reviewRoutes = require('./routes/reviews');

// Routes
app.use('/api/reviews', reviewRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Geo-Tagged Review Map API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});