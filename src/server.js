const app = require('./app');
const dbConnectionPromise = require('./config/db');

const startServer = async () => {
  try {
    await dbConnectionPromise;

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1)
  }
};

startServer()
