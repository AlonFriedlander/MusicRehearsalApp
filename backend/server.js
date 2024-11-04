import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
// import cors from 'cors';
// import morgan from 'morgan';
// import helmet from 'helmet';
// import xss from 'xss-clean';
// import mongoSanitize from 'express-mongo-sanitize';
// import rateLimit from 'express-rate-limit';
// import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import authMiddleware from './middleware/authMiddleware.js';


// Load environment variables
dotenv.config();
console.log('MongoDB URI:', process.env.MONGO_URI);

// Check required environment variables
if (!process.env.PORT || !process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('ERROR: Missing required environment variables.'.red.bold);
  process.exit(1);
}

// Connect to the database
connectDB();

// Initialize Express app
const app = express();

// Middleware to parse JSON and handle cookies
app.use(express.json());
app.use(cookieParser());

// // Security Middleware
// app.use(helmet());
// app.use(xss());
// app.use(mongoSanitize());
// app.use(hpp());

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000,  // 10 minutes
//   max: 100,  // Limit each IP to 100 requests per window
// });
// app.use(limiter);

// // Enable CORS
// app.use(cors());

// Logging HTTP requests (in development mode)
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// Auth routes
app.use('/api/auth', authRoutes);

// Basic route to test API
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Example protected route
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: `Hello, ${req.user.username}!` });
  });

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.yellow.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
