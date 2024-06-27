const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/db'); // Ensure the correct path to your Sequelize configuration

// Importing routes
const jobPostRoutes = require('./api/JobPost/job-post-routes');


const app = express();
const port = process.env.PORT || 9000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON request bodies

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

// Example default route
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
