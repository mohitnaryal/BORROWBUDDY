const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const requestRoutes = require('./routes/requestRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const statsRoutes = require('./routes/statsRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: '*', // Allow all origins for dev / local testing
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'BorrowBuddy API',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/stats', statsRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[BorrowBuddy Server] running on http://localhost:${PORT}`);
});

module.exports = { app, server };
