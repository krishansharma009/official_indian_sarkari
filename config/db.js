const { Sequelize } = require("sequelize");
const mysql = require("mysql2"); // Required for Sequelize with MySQL
require("dotenv").config(); // Load environment variables from .env file

const sequelize = new Sequelize(
  'defaultdb', // Database name
  'avnadmin',  // Username
  'AVNS_zjqFhqWSLgPT4ool4Bq', // Password
  {
    host: 'safartour-safartour.i.aivencloud.com', // Hostname
    port: 21128, // Port number
    dialect: "mysql", // Specify the dialect as MySQL
    dialectModule: mysql, // Use mysql2 explicitly for Sequelize
    dialectOptions: {
      ssl: {
        require: true, // SSL connection required
        rejectUnauthorized: false // Skip SSL validation (optional, based on server configuration)
      }
    },
  }
);

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
