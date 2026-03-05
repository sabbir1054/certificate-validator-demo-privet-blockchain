require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initFabric } = require('./fabric');
const certificateRoutes = require('./routes/certificate');

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes - matching frontend expectations
app.use('/api/certificate', certificateRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Certificate Validator API is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Initialize Fabric and start server
async function startServer() {
  try {
    console.log('Initializing Hyperledger Fabric connection...');
    await initFabric();
    console.log('Fabric connection established.');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api/certificate`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
