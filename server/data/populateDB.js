const mongoose = require('mongoose');
const Review = require('../models/Review');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env file in the server directory
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  // Try loading from current directory as fallback
  require('dotenv').config();
}

// Sample reviews data
const sampleReviews = [
  {
    title: "Beautiful Beach View",
    text: "Absolutely stunning location with crystal clear water and white sand. Perfect for a weekend getaway!",
    rating: 5,
    location: {
      type: 'Point',
      coordinates: [72.8372, 19.0760] // Mumbai
    }
  },
  {
    title: "Great Mountain Hike",
    text: "Challenging but rewarding hike with breathtaking views at the summit. Highly recommend for adventure seekers.",
    rating: 4,
    location: {
      type: 'Point',
      coordinates: [77.5676, 30.3165] // Mussoorie
    }
  },
  {
    title: "Delicious Street Food",
    text: "Amazing variety of local cuisine at affordable prices. The flavors are authentic and unforgettable.",
    rating: 5,
    location: {
      type: 'Point',
      coordinates: [77.2090, 28.7041] // Delhi
    }
  },
  {
    title: "Peaceful Temple Visit",
    text: "Serene atmosphere and beautiful architecture. A great place for meditation and reflection.",
    rating: 4,
    location: {
      type: 'Point',
      coordinates: [74.0856, 24.7671] // Ujjain
    }
  },
  {
    title: "Historical Fort Tour",
    text: "Fascinating history and well-preserved structures. The guide provided excellent insights into the region's past.",
    rating: 4,
    location: {
      type: 'Point',
      coordinates: [73.0499, 26.2850] // Jodhpur
    }
  },
  {
    title: "Scenic Waterfall",
    text: "Majestic waterfall surrounded by lush greenery. The sound of falling water is incredibly soothing.",
    rating: 5,
    location: {
      type: 'Point',
      coordinates: [74.8654, 15.4148] // Mahabaleshwar
    }
  },
  {
    title: "Lively Market Experience",
    text: "Bustling marketplace with colorful stalls and friendly vendors. Great place to shop for souvenirs.",
    rating: 3,
    location: {
      type: 'Point',
      coordinates: [73.8553, 18.5204] // Pune
    }
  },
  {
    title: "Cultural Festival",
    text: "Incredible display of local traditions and performances. The vibrant costumes and music were mesmerizing.",
    rating: 5,
    location: {
      type: 'Point',
      coordinates: [72.8759, 19.0760] // Mumbai
    }
  }
];

// Function to populate the database
const populateDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined. Please check your .env file.');
    }
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');

    // Clear existing data
    await Review.deleteMany({});
    console.log('Cleared existing reviews');

    // Insert sample data
    await Review.insertMany(sampleReviews);
    console.log(`Inserted ${sampleReviews.length} sample reviews`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database populated successfully!');
  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  }
};

// Run the function
populateDB();