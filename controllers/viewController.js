import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Tour from '../models/tourModel.js';
import User from '../models/userModel.js';
import { filterObj } from '../utils/helpers.js';

export const getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

export const getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    select: 'name review rating',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});

export const getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login',
  });
};

export const getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Account',
  });
};

export const updateUserData = catchAsync(async (req, res, next) => {
  const data = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, data, {
    new: true,
    runValidators: true,
  });

  res.status(200).render('account', {
    title: 'Account',
    user: updatedUser,
  });
});
