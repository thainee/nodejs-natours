import mongoose from 'mongoose';
import './envConfig.js';
import app from './app.js';

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection! 💥 Shutting down...');
  process.exit(1);
});

const uri = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
};

const connectDB = async () => {
  // try {
  await mongoose.connect(uri, clientOptions);
  await mongoose.connection.db.admin().command({ ping: 1 });
  console.log('Pinged your deployment. You successfully connected to MongoDB!');
  // } catch (error) {
  //   console.error('DB connection failed:', error);
  //   process.exit(1);
  // }
  // finally {
  //   // Ensures that the client will close when you finish/error
  //   await mongoose.disconnect();
  // }
};

connectDB();

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection! 💥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
