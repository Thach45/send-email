require('dotenv').config();
const express = require('express');
const cors = require('cors');
const emailRoutes = require('./routes/emailRoutes');

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Pre-flight requests
app.options('*', cors());

// Routes
app.use('/api/email', emailRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server if not in production (Vercel handles this in production)

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });


// Export the Express API
module.exports = app;