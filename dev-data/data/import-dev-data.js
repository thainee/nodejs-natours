import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Tour from './../../models/tourModel.js';
import User from '../../models/userModel.js';
import Review from '../../models/reviewModel.js';

const uri = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
};

const connectDB = async () => {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!',
    );
  } catch {
    console.dir;
  }
};

connectDB();

// READ JSON FILE
const tourFilePath = path.join(import.meta.dirname, 'tours.json');
const userFilePath = path.join(import.meta.dirname, 'users.json');
const reviewFilePath = path.join(import.meta.dirname, 'reviews.json');

const tours = JSON.parse(fs.readFileSync(tourFilePath, 'utf8'));
const users = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
const reviews = JSON.parse(fs.readFileSync(reviewFilePath, 'utf8'));

// IMPORT DATA INTO DB

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, {
      validateBeforeSave: false,
    });
    await Review.create(reviews);
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
    await User.deleteMany();
    await Review.deleteMany();
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
