const mongoose = require('mongoose');

const dbUrl = 'mongodb://localhost/madrasa';

// Connect to the MongoDB database
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Event handlers for the database connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to the database.');
});

// Close the Mongoose connection when your application exits
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

// Export the Mongoose instance for use in your application
module.exports = mongoose;
