# Event Management Application

A full-featured MERN stack application for managing events and booking tickets.

## Features

- User authentication (register, login)
- Create, view, and manage events
- Book tickets for events
- Cancel bookings
- User dashboard to manage events and bookings

## Tech Stack

- **Frontend**: React, React Router, Bootstrap, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

## Installation & Setup

### 1. Clone the repository

```
git clone <repository-url>
cd event-management-app
```

### 2. Setup Backend

```
cd backend
npm install
```

Create a `.env` file in the backend directory with the following content:

```
MONGO_URI=mongodb://localhost:27017/eventmanagement
JWT_SECRET=your_jwt_secret
PORT=5000
```

Replace `your_jwt_secret` with a secure random string.
Update the MONGO_URI if you're using MongoDB Atlas.

### 3. Setup Frontend

```
cd ../frontend
npm install
```

### 4. Run the Application

#### Backend:

```
cd backend
npm run dev
```

#### Frontend:

```
cd frontend
npm start
```

The application will be available at http://localhost:3000

## API Endpoints

### Users

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user profile

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get specific event
- `POST /api/events` - Create an event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event
- `GET /api/events/user/myevents` - Get current user's events

### Bookings

- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get specific booking
- `POST /api/bookings` - Create a booking
- `PUT /api/bookings/:id/cancel` - Cancel a booking

## License

MIT #   e v e n t  
 