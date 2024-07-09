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
const admitRoutes = require('./api/admitcard/admit-card-routes');
const answerKeyRoutes = require('./api/answerKey/answer-key-routes');
const resultRoutes = require('./api/result/result-routes');
const booksRoutes = require('./api/ReadingBooks/book-routes');
const blogsRoutes = require('./api/blogs/blog-routes');
const oldpaperRoutes = require('./api/oldPapers/old-papers-routes');

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
app.use('/api/admit', admitRoutes);
app.use('/api/answer', answerKeyRoutes);
app.use('/api/result', resultRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/oldpapers', oldpaperRoutes);


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