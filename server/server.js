import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/connect.js';
import { initDemoData } from './utils/demoDataHelper.js';
import userRoutes from './routes/userRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import Book from './models/Book.js';
import Seller from './models/Seller.js';
import User from './models/User.js';

// Resolve directory paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config();

// Connect to Database
await connectDB();

// Initialize Demo Seller and Demo Books on startup (with duplicate checks)
await initDemoData();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
  "http://localhost:5173",
  "https://book-verse-skills-wallet.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(helmet({
  crossOriginResourcePolicy: false // Allow loading images from different origins
}));
app.use(cookieParser());
app.use(morgan('dev'));

// Static files serving (Uploads folder)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Registration
app.use('/api/users', userRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);

// Statistics Route (Real counts from MongoDB Atlas)
app.get('/api/stats', async (req, res) => {
  try {
    const booksCount = await Book.countDocuments({});
    const sellersCount = await Seller.countDocuments({ isApproved: true });
    const usersCount = await User.countDocuments({});
    
    return res.status(200).json({
      success: true,
      books: booksCount,
      sellers: sellersCount,
      users: usersCount
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Root Route
app.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'SkillWallet Book Store API Running',
  });
});

// Error handling middleware fallback
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
