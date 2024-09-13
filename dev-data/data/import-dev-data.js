import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Tour from './../../models/tourModel.js';

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
  // finally {
  //   // Ensures that the client will close when you finish/error
  //   await mongoose.disconnect();
  // }
};

connectDB();

// READ JSON FILE
const filePath = path.join(import.meta.dirname, 'tours.json');
const tours = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// IMPORT DATA INTO DB

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data imported successfully');
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data deleted successfully');
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
