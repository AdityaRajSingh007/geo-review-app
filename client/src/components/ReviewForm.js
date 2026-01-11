import React, { useState } from 'react';
import './ReviewForm.css';

const ReviewForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    rating: 5,
    location: {
      latitude: null,
      longitude: null
    }
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: parseFloat(value) || null
      }
    }));
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setFormErrors({});

    if (!navigator.geolocation) {
      setFormErrors({ location: 'Geolocation is not supported by your browser' });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        }));
        setIsGettingLocation(false);
      },
      (error) => {
        setFormErrors({ location: `Unable to retrieve your location: ${error.message}` });
        setIsGettingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.text.trim()) errors.text = 'Review text is required';
    if (formData.location.latitude === null || formData.location.longitude === null) {
      errors.location = 'Please set a location for your review';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const success = await onSubmit(formData);
    if (success) {
      // Reset form
      setFormData({
        title: '',
        text: '',
        rating: 5,
        location: {
          latitude: null,
          longitude: null
        }
      });
      setFormErrors({});
    } else {
      setFormErrors({ submit: 'Failed to submit review. Please try again.' });
    }
  };

  return (
    <div className="review-form-container">
      <h3>Add New Review</h3>
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Review title"
          />
          {formErrors.title && <span className="error">{formErrors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="text">Review *</label>
          <textarea
            id="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            placeholder="Write your review here..."
            rows="4"
          ></textarea>
          {formErrors.text && <span className="error">{formErrors.text}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        <div className="form-group location-group">
          <label>Location *</label>
          <div className="location-inputs">
            <div className="coordinate-input">
              <input
                type="number"
                name="latitude"
                value={formData.location.latitude || ''}
                onChange={handleLocationChange}
                placeholder="Latitude"
                step="any"
              />
            </div>
            <div className="coordinate-input">
              <input
                type="number"
                name="longitude"
                value={formData.location.longitude || ''}
                onChange={handleLocationChange}
                placeholder="Longitude"
                step="any"
              />
            </div>
          </div>
          <button 
            type="button" 
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="get-location-btn"
          >
            {isGettingLocation ? 'Getting Location...' : 'Use Current Location'}
          </button>
          {formErrors.location && <span className="error">{formErrors.location}</span>}
        </div>

        <div className="form-group">
          <button type="submit" className="submit-btn">Submit Review</button>
        </div>
        
        {formErrors.submit && <div className="error submit-error">{formErrors.submit}</div>}
      </form>
    </div>
  );
};

export default ReviewForm;