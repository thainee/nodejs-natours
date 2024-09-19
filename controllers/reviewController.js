import Review from '../models/reviewModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import * as factory from './handlerFactory.js';

export const setTourId = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

export const updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  if (review.user._id.toString() !== req.user.id) {
    return next(new AppError('You are not allowed to update this review', 403));
  }

  const newReview = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

export const deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  if (req.user.role === 'admin') {
    await Review.findByIdAndDelete(req.params.id);
    return res.status(204).json(null);
  }

  if (review.user._id.toString() !== req.user.id) {
    return next(new AppError('You are not allowed to delete this review', 403));
  }

  await Review.findByIdAndDelete(req.params.id);
  res.status(204).json(null);
});

export const getAllReviews = factory.getAll(Review);

export const getReview = factory.getOne(Review);

export const createReview = factory.createOne(Review);
