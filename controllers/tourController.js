import multer from 'multer';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import Tour from '../models/tourModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import * as factory from './handlerFactory.js';

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

export const resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  const processImage = async (file, filename, width, height) => {
    const buffer = await sharp(file.buffer)
      .resize(width, height)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toBuffer();

    await fs.writeFile(`public/img/tours/${filename}`, buffer);
    return filename;
  };

  const imageTasks = [
    // Cover image
    processImage(
      req.files.imageCover[0],
      `tour-${req.params.id}-cover.jpg`,
      2000,
      1333,
    ),
    ...req.files.images.map((file, i) => {
      return processImage(
        file,
        `tour-${req.params.id}-${i + 1}.jpg`,
        2000,
        1333,
      );
    }),
  ];

  const processedImages = await Promise.all(imageTasks);

  req.body.imageCover = processedImages[0];
  req.body.images = processedImages.slice(1);
  
  next();
});

export const aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

export const getAllTour = factory.getAll(Tour);

export const getTour = factory.getOne(Tour, { path: 'reviews' });

export const createTour = factory.createOne(Tour);

export const updateTour = factory.updateOne(Tour);

export const deleteTour = factory.deleteOne(Tour);

export const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});

export const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStart: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numToursStart: -1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: { plan },
  });
});

// tours-within/233/center/21.024661, 105.833788/unit/mi
// tours-within/:distance/center/:latlng/unit/:unit

export const getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(/,\s*/);

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400,
      ),
    );
  }

  const MILE_TO_RADIAN = 3963.2;
  const KILOMETER_TO_RADIAN = 6378.1;
  const radians =
    unit === 'mi' ? distance / MILE_TO_RADIAN : distance / KILOMETER_TO_RADIAN;

  const tours = await Tour.find({
    startLocation: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radians],
      },
    },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

export const getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(/,\s*/);

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longtitude in the format lat,lng.',
        400,
      ),
    );
  }

  const METER_TO_MILE = 0.000621371192;
  const METER_TO_KILOMETER = 0.001;
  const multiplier = unit === 'mi' ? METER_TO_MILE : METER_TO_KILOMETER;

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [lng * 1, lat * 1] },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: distances.length,
    data: {
      tours: distances,
    },
  });
});
