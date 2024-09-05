import AppError from '../utils/appError.js';

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsErrorDB = (err) => {
  const errors = Object.entries(err.keyValue).map(
    ([key, value]) => `Duplicate value: '${value}' for field: '${key}'`
  );
  const message = `${errors.join('. ')}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () => new AppError('Your session has expired. Please log in again!', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });

    // Programming or other unknown error: dont't leak error details
  } else {
    // 1) Log error
    console.error('Error 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let newError = Object.create(err);
    if (newError.name === 'CastError') newError = handleCastErrorDB(newError);
    if (newError.code === 11000)
      newError = handleDuplicateFieldsErrorDB(newError);
    if (newError.name === 'ValidationError')
      newError = handleValidationErrorDB(newError);
    if (newError.name === 'JsonWebTokenError')
      newError = handleJWTError();
    if (newError.name === 'TokenExpiredError')
      newError = handleJWTExpiredError();

    sendErrorProd(newError, res);
  }
};
