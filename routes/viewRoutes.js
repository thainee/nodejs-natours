import express from 'express';
import * as viewController from '../controllers/viewController.js';
import * as authController from '../controllers/authController.js';
// import * as bookingController from '../controllers/bookingController.js';  

const router = express.Router();

router.use(viewController.alerts);

router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);

router.use(authController.isLoggedIn);

router.get(
  '/',
  // bookingController.createBookingCheckout,
  viewController.getOverview,
);
router.get('/tours/:slug', viewController.getTour);
router.get('/login', viewController.getLoginForm);

export default router;
