import React, { useState, useEffect } from 'react';
import './App.css';
import MapComponent from './components/MapComponent';
import ReviewForm from './components/ReviewForm';
import FilterPanel from './components/FilterPanel';

function App() {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [filters, setFilters] = useState({
    minRating: 1,
    maxRating: 5,
    lat: null,
    lng: null,
    proximityRadius: 10 // in km
  });

  // Load reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const queryParams = {};
        if (filters.minRating !== undefined && filters.minRating !== null) {
          queryParams.minRating = filters.minRating;
        }
        if (filters.maxRating !== undefined && filters.maxRating !== null) {
          queryParams.maxRating = filters.maxRating;
        }
        if (filters.lat !== undefined && filters.lat !== null) {
          queryParams.lat = filters.lat;
        }
        if (filters.lng !== undefined && filters.lng !== null) {
          queryParams.lng = filters.lng;
        }
        if (filters.proximityRadius !== undefined && filters.proximityRadius !== null) {
          queryParams.radius = filters.proximityRadius;
        }

        const queryString = new URLSearchParams(queryParams).toString();
        const url = queryString ? `https://geo-review-app.onrender.com/api/reviews?${queryString}` : `https://geo-review-app.onrender.com/api/reviews`;

        const response = await fetch(url);
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [filters]);

  const handleReviewSubmit = async (reviewData) => {
    try {
      const response = await fetch('https://geo-review-app.onrender.com/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        const newReview = await response.json();
        setReviews([newReview, ...reviews]);
        return true;
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
    return false;
  };

  const handleReviewUpdate = async (id, reviewData) => {
    try {
      const response = await fetch(`https://geo-review-app.onrender.com/api/reviews/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        const updatedReview = await response.json();
        setReviews(reviews.map(r => r._id === id ? updatedReview : r));
        return true;
      }
    } catch (error) {
      console.error('Error updating review:', error);
    }
    return false;
  };

  const handleReviewDelete = async (id) => {
    try {
      const response = await fetch(`https://geo-review-app.onrender.com/api/reviews/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setReviews(reviews.filter(r => r._id !== id));
        if (selectedReview && selectedReview._id === id) {
          setSelectedReview(null);
        }
        return true;
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
    return false;
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Geo-Tagged Review Map</h1>
      </header>
      
      <div className="app-container">
        <div className="left-panel">
          <ReviewForm onSubmit={handleReviewSubmit} />
          <FilterPanel 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
          <div className="reviews-list">
            <h3>All Reviews ({reviews.length})</h3>
            <div className="reviews-scrollable">
              {reviews.map(review => (
                <div 
                  key={review._id} 
                  className={`review-item ${selectedReview?._id === review._id ? 'selected' : ''}`}
                  onClick={() => setSelectedReview(review)}
                >
                  <h4>{review.title}</h4>
                  <p>Rating: {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</p>
                  <p>{review.text.substring(0, 100)}{review.text.length > 100 ? '...' : ''}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="map-container">
          <MapComponent 
            reviews={reviews} 
            selectedReview={selectedReview}
            onSelectReview={setSelectedReview}
            onReviewUpdate={handleReviewUpdate}
            onReviewDelete={handleReviewDelete}
          />
        </div>
      </div>
      
      <footer className="app-footer">
        <p>Built by <a href="https://www.linkedin.com/in/adityarajsingh007/" target="_blank" rel="noopener noreferrer">Aditya Raj Singh</a></p>
      </footer>
    </div>
  );
}

export default App;