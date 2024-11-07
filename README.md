# Music Rehearsal App

## Overview
The **Music Rehearsal App** is a full-stack web application designed to help musicians manage rehearsal sessions. Users can select songs, view lyrics with chords, and use features like auto-scrolling. The app facilitates real-time communication between users and admins for seamless session management.

## Project Structure
#### Below is the project structure to help you understand how the codebase is organized:
```
MusicRehearsalApp/
    ├── backend/                # Backend server-side code
    │   ├── controllers/        # Functions handling the logic for different routes
    │   ├── models/             # Mongoose models defining database schemas
    │   ├── routes/             # Route definitions for the server API endpoints
    │   ├── config/             # Configuration files (e.g., database connection)
    │   └── server.js           # Main server file to start the backend application
    │
    ├── frontend/               # Frontend client-side code
    │   ├── public/             # Public assets like images and the main HTML file
    │   ├── src/                # Main source code for the React application
    │   │   ├── components/     # Reusable React components
    │   │   ├── pages/          # Individual pages for the application
    │   │   ├── hooks/          # Custom React hooks
    │   │   └── App.js          # Main React app component
    │
    └── README.md              

```

## Prerequisites
1. **Node.js and npm:** Make sure Node.js and npm are installed on your system.
2. **MongoDB Atlas:** The app uses MongoDB Atlas as the primary database. Ensure you have an account and have created a database. You will need the connection string to set up the environment variable MONGO_URI in the backend .env file.

3. **Git:** To clone the repository, you need Git installed.


## Get Started

To get started with the Music Rehearsal App, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AlonFriedlander/MusicRehearsalApp.git
    ```
2. **Navigate to the main directory:**
    ```bash
    cd MusicRehearsalApp
    ```
3. **Install dependencies for both the frontend and backend:**
    * Navigate to the backend directory and install dependencies:
        ```bash
        cd backend
        npm install
        ```
    * Navigate to the frontend directory and install dependencies:
        ```bash
        cd ../frontend
        npm install
        ```
**Before continuing, make sure to set up the required environment variables as described in the Environment Variables section below.**

4. **Run the development servers:**
    * Start the backend server:
        ```bash
        cd ../backend
        npm start
        ```
    * Start the frontend server:
        ```bash
        cd ../frontend
        npm start
        ```


## Environment Variables
Ensure you set up the following environment variables before running the app:

Backend (.env in the backend directory):
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
Frontend (.env in the frontend directory):
```bash
REACT_APP_BACKEND_URL=http://localhost:5000
```
Replace your_mongodb_connection_string and your_jwt_secret with your actual values. Ensure these .env files are excluded from version control by checking your .gitignore file.

### notes:
* **PORT:** The port where the backend server runs (default: 5000).
* **MONGO_URI:** The MongoDB connection string for the database.
* **JWT_SECRET:** A secret key used to sign and verify JWT tokens.
* **REACT_APP_BACKEND_URL:** The URL the frontend uses to communicate with the backend server.


## API Endpoints
### Authentication
* **POST /api/auth/register:** Registers a new user with a username, password, instrument, and role.
* **POST /api/auth/login:** Logs in an existing user and returns an authentication token.
* **GET /api/auth/validate-token:** Validates the user's token and returns user information.
* **GET /api/auth/validate-admin-token:** Validates the admin's token and returns admin

### Rehearsal Management
* **GET /api/rehearsal/search:** Searches for songs based on a query string.
* **POST /api/rehearsal/select:** Selects a song to be used in a live session.
* **GET /api/rehearsal/live/song:** Retrieves the current live song's data.
* **POST /api/rehearsal/admin/quit-session:** Ends the current rehearsal session.



## This app is constructed from two main projects:

* **Backend:** Handles the server-side logic, database operations, and real-time socket communication.

* **Frontend:** Provides the user interface for interacting with the app, including selecting songs and viewing lyrics.