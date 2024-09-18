import express from 'express';
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

router.use(authController.protect);

router.patch(
  '/update-password',
  authController.protect,
  authController.updatePassword,
);
router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser,
);
router.patch('/update-me', authController.protect, userController.updateMe);
router.delete('/delete-me', authController.protect, userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
