import APIFeatures from '../utils/apiFeatures.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;

    const modelName = `${Model.modelName.toLowerCase()}s`;
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        [modelName]: docs,
      },
    });
  });

export const getOne = (Model, populateOpions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (populateOpions) query = query.populate(populateOpions);

    const doc = await query;
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    const modelName = Model.modelName.toLowerCase();

    res.status(200).json({
      status: 'success',
      data: {
        [modelName]: doc,
      },
    });
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    const modelName = Model.modelName.toLowerCase();

    res.status(201).json({
      status: 'success',
      [modelName]: doc,
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    const modelName = Model.modelName.toLowerCase();

    res.status(200).json({
      status: 'success',
      data: {
        [modelName]: doc,
      },
    });
  });

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
