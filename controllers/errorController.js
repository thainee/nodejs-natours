export const globalErrorHandler = (err, req, res, next) => {
  console.log(err.stack);
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  res.status(statusCode).json({
    status,
    message: err.message,
  });
};
