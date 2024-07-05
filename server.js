const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/db');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Importing routes
const jobPostRoutes = require('./api/JobPost/job-post-routes');
const authRoutes = require('./api/userProfile/auth-routes');

const app = express();
const port = process.env.PORT || 9000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sync Sequelize models with the database
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

// Routes middleware
app.use('/api/job-posts', jobPostRoutes);
app.use('/api/auth', authRoutes);

// Example default route
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});