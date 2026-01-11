const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const { minRating, maxRating, lat, lng, radius } = req.query;
    let query = {};

    // Rating filtering
    if (minRating || maxRating) {
      query.rating = {};
      if (minRating) query.rating.$gte = Number(minRating);
      if (maxRating) query.rating.$lte = Number(maxRating);
    }

    // Proximity filtering
    if (lat && lng && radius) {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: Number(radius) * 1000 // Convert km to meters
        }
      };
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single review
router.get('/:id', getReview, (req, res) => {
  res.json(res.review);
});

// Create a new review
router.post('/', async (req, res) => {
  const { title, text, rating, location } = req.body;

  const review = new Review({
    title,
    text,
    rating,
    location: {
      type: 'Point',
      coordinates: [location.longitude, location.latitude]
    }
  });

  try {
    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a review
router.patch('/:id', getReview, async (req, res) => {
  const { title, text, rating, location } = req.body;

  if (title != null) res.review.title = title;
  if (text != null) res.review.text = text;
  if (rating != null) res.review.rating = rating;
 if (location != null) {
    res.review.location = {
      type: 'Point',
      coordinates: [location.longitude, location.latitude]
    };
  }

  try {
    const updatedReview = await res.review.save();
    res.json(updatedReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a review
router.delete('/:id', getReview, async (req, res) => {
  try {
    await Review.deleteOne({ _id: res.review._id });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get review by ID
async function getReview(req, res, next) {
  let review;
  try {
    review = await Review.findById(req.params.id);
    if (review == null) {
      return res.status(404).json({ message: 'Review not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.review = review;
  next();
}

module.exports = router;