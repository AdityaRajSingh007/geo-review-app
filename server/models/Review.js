const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  text: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      index: '2dsphere'
    }
  }
}, {
 timestamps: true
});

// Create geospatial index
reviewSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('Review', reviewSchema);