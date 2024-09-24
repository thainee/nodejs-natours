import AppError from '../utils/appError.js';

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsErrorDB = (err) => {
  const errors = Object.entries(err.keyValue).map(
    ([key, value]) => `Duplicate value: '${value}' for field: '${key}'`,
  );
  const message = `${errors.join('. ')}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your session has expired. Please log in again!', 401);

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // B) RENDER WEBSITE
  console.error('Error 💥', err);
  res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  // Operational, trusted error: send message to client
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

      // Programming or other unknown error: dont't leak error details
    }
    // 1) Log error
    console.error('Error 💥', err);

    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  } else {
    // B) RENDER WEBSITE
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: err.message,
      });

      // Programming or other unknown error: dont't leak error details
    }
    // 1) Log error

    // 2) Send generic message
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: 'Please try again later!',
    });
  }
};

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let newError = Object.create(err);
    if (newError.name === 'CastError') newError = handleCastErrorDB(newError);
    if (newError.code === 11000)
      newError = handleDuplicateFieldsErrorDB(newError);
    if (newError.name === 'ValidationError')
      newError = handleValidationErrorDB(newError);
    if (newError.name === 'JsonWebTokenError') newError = handleJWTError();
    if (newError.name === 'TokenExpiredError')
      newError = handleJWTExpiredError();

    sendErrorProd(newError, req, res);
  }
};
