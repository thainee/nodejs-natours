import mongoose from 'mongoose';
import app from './app.js';

const uri = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
};

const connectDB = async () => {
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } catch (error) {
    console.error('DB connection failed:', error.message);
    process.exit(1);
  }
};

connectDB();

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
