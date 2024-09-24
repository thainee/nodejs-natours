import express from 'express';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import path from 'node:path';
import cookieParser from 'cookie-parser';

import AppError from './utils/appError.js';
import { globalErrorHandler } from './controllers/errorController.js';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import viewRouter from './routes/viewRoutes.js';

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(import.meta.dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(import.meta.dirname, 'public')));

// Set security HTTP headers
const cspConfig = {
  directives: {
    'default-src': ["'self'", 'https:', 'http:', 'data:', 'ws:'],
    'script-src': [
      "'self'",
      'https://cdnjs.cloudflare.com',
      'https://api.mapbox.com',
    ],
    'style-src': [
      "'self'",
      'https://api.mapbox.com',
      'https://fonts.googleapis.com',
    ],
    'worker-src': ["'self'", 'blob:'],
  },
};

app.use(
  helmet({
    contentSecurityPolicy: cspConfig,
  }),
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same api
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 150,
  message: 'Too many requests from this IP, please try again after 15 minutes!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use((req, res, next) => {
  Object.keys(req.body).forEach((key) => {
    if (typeof req.body[key] === 'string') {
      req.body[key] = xss(req.body[key]);
    }
  });
  next();
});

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
