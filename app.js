import express from 'express';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';

import AppError from './utils/appError.js';
import { globalErrorHandler } from './controllers/errorController.js';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();

// 1) GLOBAL MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 150,
  message: 'Too many requests from this IP, please try again after 15 minutes!',
});
app.use('/api', limiter);

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
