require('dotenv').config(); // Explicit env loading

const app = require('./app');
const connectDB = require('./db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB(); // Ensures DB is ready before starting server

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
