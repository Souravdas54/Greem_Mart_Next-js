import express from 'express';

const userRouter = express.Router()

import { authorizeRoles, protect, refreshTokenProtect } from '../middleware/Middleware';
import { CreateUploadfolder } from '../middleware/Upload.middleware';
import { userController } from '../controllers/User.Controller';
import { otpVerification } from '../validation/Otp.Verification';

const upload = CreateUploadfolder('green mart')

userRouter.post('/signup', upload.single('avatarUrl'), userController.register)

userRouter.post('/signin', userController.login)

userRouter.post('/verify-otp', otpVerification.verify_Otp)
userRouter.post('/resend-otp', otpVerification.resend_OTP)

userRouter.post('/refresh-token', refreshTokenProtect, userController.refreshToken);

userRouter.get('/profile/user/:id', protect, authorizeRoles('super_admin', 'nursery_admin', 'user'), userController.getUserwithId);
userRouter.put('/profile/update/:id', protect, authorizeRoles('super_admin', 'nursery_admin', 'user'), upload.single('avatarUrl'), userController.updateProfile);

userRouter.post('/logout', protect, userController.logout);


export { userRouter }