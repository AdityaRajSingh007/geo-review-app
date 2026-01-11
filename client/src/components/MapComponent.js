import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = ({ reviews, selectedReview, onSelectReview, onReviewUpdate, onReviewDelete }) => {
  const [center, setCenter] = useState([20.5937, 78.9629]); // Center of India
  const [zoom, setZoom] = useState(5);
  const [editingReview, setEditingReview] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    text: '',
    rating: 5
  });

  // Update map center when a review is selected
  useEffect(() => {
    if (selectedReview) {
      setCenter([selectedReview.location.coordinates[1], selectedReview.location.coordinates[0]]);
      setZoom(13);
    }
  }, [selectedReview]);

  const handleMarkerClick = (review) => {
    onSelectReview(review);
  };

  const handleEditClick = (e, review) => {
    e.stopPropagation();
    setEditingReview(review);
    setEditFormData({
      title: review.title,
      text: review.text,
      rating: review.rating
    });
  };

  const handleDeleteClick = (e, reviewId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this review?')) {
      onReviewDelete(reviewId);
      setEditingReview(null);
    }
  };

  const handleEditSubmit = (e, reviewId) => {
    e.stopPropagation();
    onReviewUpdate(reviewId, editFormData);
    setEditingReview(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMapClick = (e) => {
    onSelectReview(null);
  };

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height: '100%', width: '100%' }}
      onClick={handleMapClick}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {reviews.map(review => (
        <Marker
          key={review._id}
          position={[review.location.coordinates[1], review.location.coordinates[0]]}
          eventHandlers={{
            click: () => handleMarkerClick(review),
          }}
        >
          <Popup>
            <div className="popup-content">
              <h3>{review.title}</h3>
              <p>Rating: {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</p>
              <p>{review.text}</p>
              
              {editingReview && editingReview._id === review._id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleEditChange}
                    placeholder="Title"
                  />
                  <textarea
                    name="text"
                    value={editFormData.text}
                    onChange={handleEditChange}
                    placeholder="Review text"
                  />
                  <select
                    name="rating"
                    value={editFormData.rating}
                    onChange={handleEditChange}
                  >
                    {[1, 2, 3, 4, 5].map(rating => (
                      <option key={rating} value={rating}>{rating} Star{rating !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                  <button onClick={(e) => handleEditSubmit(e, review._id)}>Save</button>
                  <button onClick={() => setEditingReview(null)}>Cancel</button>
                </div>
              ) : (
                <div className="popup-actions">
                  <button onClick={(e) => handleEditClick(e, review)}>Edit</button>
                  <button onClick={(e) => handleDeleteClick(e, review._id)}>Delete</button>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;