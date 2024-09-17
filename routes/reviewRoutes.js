import express from 'express';

import * as authController from '../controllers/authController.js';
import * as reviewController from '../controllers/reviewController.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview,
  );

router
  .route('/:id')
  .delete(authController.protect, reviewController.deleteReview);

export default router;
