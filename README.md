# Geo-Tagged Review Map

A MERN stack application that allows users to post reviews tied to geographic locations and view them on an interactive map.

## 🚀 Live Demo

The application is deployed and running on:
- Client (Frontend): Deployed on Vercel
- Server (Backend): Deployed on Render

## Features

- Post reviews with title, text, rating, and geolocation
- View reviews on an interactive map using Leaflet
- Filter reviews by rating range
- Filter reviews by proximity to a location
- Edit and delete existing reviews
- Responsive design for mobile and desktop

## Table of Contents

- [Architecture](#architecture)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [API Specifications](#api-specifications)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

## Architecture

This full-stack application follows a microservices architecture pattern with a separation between the frontend and backend services:

### Frontend Architecture
- **React.js**: Component-based UI framework
- **React Leaflet**: Interactive mapping functionality
- **CSS**: Styling and responsive design
- **Proxy Configuration**: Development proxy to backend API

### Backend Architecture
- **Node.js**: Runtime environment
- **Express.js**: Web framework for API endpoints
- **MongoDB**: NoSQL database with geospatial indexing
- **Mongoose**: ODM for MongoDB interactions
- **Cors**: Cross-origin resource sharing support

### Data Flow
1. User interacts with the frontend application
2. Frontend makes API calls to the backend server
3. Backend processes requests and communicates with MongoDB
4. Geospatial queries leverage MongoDB's geospatial indexes
5. Results are returned to the frontend for display

## Technologies Used

- **Frontend**: React.js, Leaflet.js, React-Leaflet, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with geospatial indexing
- **ODM**: Mongoose
- **Styling**: CSS
- **Development**: NPM, Proxy setup

## Project Structure

```
geo-review-app/
├── client/                 # React frontend
│   ├── public/             # Static assets
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── FilterPanel.css
│   │   ├── FilterPanel.js
│   │   │   ├── MapComponent.css
│   │   │   ├── MapComponent.js
│   │   │   ├── ReviewForm.css
│   │   └── ReviewForm.js
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── index.css
│   │   ├── index.js
│   │   └── setupProxy.js   # Development proxy configuration
│   └── package.json
├── server/                 # Node.js backend
│   ├── .env                # Environment variables (not committed)
│   ├── .env.example        # Example environment variables
│   ├── data/
│   │   └── populateDB.js   # Sample data population script
│   ├── models/
│   │   └── Review.js       # Mongoose model
│   ├── routes/
│   │   └── reviews.js      # API routes
│   ├── server.js           # Main server file
│   └── package.json
├── screenshots/            # Application screenshots
│   ├── homepage.png
│   ├── menus.png
│   ├── review delete.png
│   ├── review edit.png
│   └── review.png
├── .gitignore              # Git ignore configuration
└── README.md
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (for remote database connection)
- Git

### Local Development Setup

#### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```bash
PORT=500
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
```

4. Start the server in development mode:
```bash
npm run dev
```

#### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. The application will open in your default browser at `http://localhost:3000`

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

```bash
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
```

### Environment Variables Explanation

- `PORT`: Port number for the backend server (default: 5000)
- `MONGODB_URI`: Connection string for MongoDB Atlas database

### .env.example File

An example environment file is provided in `server/.env.example` with the required variable formats.

## API Specifications

### Base URL
`http://localhost:5000/api` (development) or production URL

### Authentication
No authentication required for basic operations

### API Endpoints

#### Reviews Endpoints

- `GET /api/reviews` - Get all reviews (with optional filters)
  - Query Parameters:
    - `minRating` (number): Minimum rating filter
    - `maxRating` (number): Maximum rating filter
    - `lat` (number): Latitude for proximity filter
    - `lng` (number): Longitude for proximity filter
    - `radius` (number): Radius in kilometers for proximity filter
  - Response: Array of review objects

- `GET /api/reviews/:id` - Get a specific review
  - Path Parameter: `id` (string) - Review ID
  - Response: Single review object

- `POST /api/reviews` - Create a new review
  - Request Body:
    ```json
    {
      "title": "string (required)",
      "text": "string (required)",
      "rating": "number (1-5, required)",
      "location": {
        "longitude": "number (required)",
        "latitude": "number (required)"
      }
    }
    ```
  - Response: Created review object

- `PATCH /api/reviews/:id` - Update a review
  - Path Parameter: `id` (string) - Review ID
  - Request Body: Same as POST but all fields optional
  - Response: Updated review object

- `DELETE /api/reviews/:id` - Delete a review
  - Path Parameter: `id` (string) - Review ID
  - Response: Success message

### Error Responses

All error responses follow the format:
```json
{
  "message": "Error description"
}
```

## Database Schema

Reviews are stored in MongoDB with the following schema:

```javascript
{
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
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Geospatial Indexing

The database implements a geospatial index on the location field:
- Index Type: `2dsphere`
- Field: `location`
- Enables efficient proximity-based queries

## Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect to your GitHub repository
3. Set the root directory to `/server`
4. Configure environment variables:
   - `PORT`: Leave blank (Render sets this automatically)
   - `MONGODB_URI`: Your MongoDB Atlas connection string
5. Set the start command to: `npm start`
6. Deploy the service

### Frontend Deployment (Vercel)

1. Create a new project on Vercel
2. Connect to your GitHub repository
3. Set the root directory to `/client`
4. Configure environment variables if needed
5. Set the build command to: `npm run build`
6. Set the output directory to: `build`
7. Set the install command to: `npm install`
8. Deploy the application

### Environment Variables for Production

For production deployments, ensure the following environment variables are set:

#### Backend (Render)
- `MONGODB_URI`: MongoDB Atlas connection string
- `NODE_ENV`: Set to `production` (optional)

#### Frontend (Vercel)
- API endpoint configuration should point to your deployed backend URL

### Build Process

#### Backend Build
The backend uses a standard Node.js setup with no special build requirements.

#### Frontend Build
The frontend uses Create React App build process:
```bash
npm run build
```

## Usage

1. Clone the repository:
```bash
git clone <repository-url>
cd geo-review-app
```

2. Install dependencies for both client and server:
```bash
cd server && npm install
cd ../client && npm install
```

3. Set up environment variables in `server/.env`

4. Populate the database with sample data (optional):
```bash
cd server && node data/populateDB.js
```

5. Start the backend server:
```bash
cd server && npm run dev
```

6. In a new terminal, start the frontend server:
```bash
cd client && npm start
```

7. Open your browser and navigate to `http://localhost:3000`

## API Endpoints Testing

You can test the API endpoints directly:

- Get all reviews: `GET http://localhost:5000/api/reviews`
- Get reviews with rating filter: `GET http://localhost:5000/api/reviews?minRating=4&maxRating=5`
- Get reviews with proximity filter: `GET http://localhost:5000/api/reviews?lat=19.076&lng=72.877&radius=10`
- Get a specific review: `GET http://localhost:5000/api/reviews/{reviewId}`
- Create a new review: `POST http://localhost:5000/api/reviews`
- Update a review: `PATCH http://localhost:5000/api/reviews/{reviewId}`
- Delete a review: `DELETE http://localhost:5000/api/reviews/{reviewId}`

## Screenshots

Here are some screenshots of the application in action:

### Homepage
![Homepage](screenshots/homepage.png)

### Menu Interface
![Menu Interface](screenshots/menus.png)

### Review Creation
![Review Creation](screenshots/review.png)

### Review Editing
![Review Editing](screenshots/review%20edit.png)

### Review Deletion
![Review Deletion](screenshots/review%20delete.png)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write clear commit messages
- Test your changes thoroughly
- Update documentation as needed
- Ensure all tests pass before submitting a pull request