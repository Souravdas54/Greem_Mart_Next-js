import { Request, Response } from 'express';
import otpModel, { OtpInterface } from '../models/otp.model';

import { userModel } from '../models/User.Model';
import { UserInterface } from '../interface/User.Interface';

import { sendOtpEmail } from '../service/send.otpmail.service';
import { emailService } from '../service/email.service';

interface VerifyOtpRequest extends Request {
    body: {
        userId: string;
        otp: string;
        email?: string;
    }
}

interface ResendOtpRequest extends Request {
    body: {
        userId: string;
        email?: string;

    }
}

class OtpVerification {
    async verify_Otp(req: VerifyOtpRequest, res: Response): Promise<Response> {
        try {
            const { userId, otp, email } = req.body;
            console.log('Verify OTP Request:', { userId, otp });
            // Validate input
            if (!otp || (!userId && !email)) {
                console.log("OTP and either User ID or Email are required");
                return res.status(400).json({
                    success: false,
                    message: "OTP and either User ID or Email are required"
                });
            }

            // Find user by userId or email
            let user;
            if (userId) {
                user = await userModel.findById(userId);
            } else if (email) {
                user = await userModel.findOne({ email });
            }

            if (!user) {
                console.log("User not found");
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Check if user is already verified
            if (user.isVerified) {
                console.log("User is already verified");
                return res.status(400).json({
                    success: false,
                    message: "User is already verified"
                });
            }

            // Find the OTP in database
            const otpRecord = await otpModel.findOne({
                userId: userId,
                otp: otp
            }).sort({ createdAt: -1 });

            if (!otpRecord) {
                console.log("Invalid OTP or OTP expired");
                return res.status(400).json({
                    success: false,
                    message: "Invalid OTP or OTP expired"
                });
            }

            // Check if OTP is expired (assuming OTP valid for 10 minutes)
            const now = new Date();
            const otpExpiryTime = new Date(otpRecord.createdAt);
            otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 1 * 60 * 1000); // 1 minutes expiry

            if (now > otpExpiryTime) {
                // Delete expired OTP
                await otpModel.deleteOne({ _id: otpRecord._id });
                console.log("OTP expired");
                return res.status(400).json({
                    success: false,
                    message: "OTP has expired. Please request a new one."
                });
            }

            // Update user's verification status
            const updatedUser = await userModel.findByIdAndUpdate(
                userId,
                { isVerified: true, verifiedAt: new Date() },
                { new: true }
            );

            if (!updatedUser) {
                console.log("Failed to update user verification status");
                return res.status(404).json({
                    success: false,
                    message: "Failed to update user verification status"
                });
            }

            // Delete the OTP record after successful verification
            await otpModel.deleteOne({ _id: otpRecord._id });

            console.log("OTP verified successfully", userId);

            // STEP 2: Send welcome email after successful verification
            let welcomeEmailSent = false;
            try {

                const userData = updatedUser as any;

                const emailResult = await emailService.sendWelcomeEmail(
                    userData.email,
                    userData.name
                );

                if (emailResult.success) {
                    console.log('✅ Welcome email sent successfully');
                    welcomeEmailSent = true;
                } else {
                    console.log('⚠️ Verification successful but welcome email failed:', emailResult.error);
                }
            } catch (emailError) {
                console.log('⚠️ Welcome email service error:', emailError);
            }

            // Send success response
            return res.json({
                success: true,
                message: "OTP verified successfully",
                user: {
                    id: updatedUser._id,
                    email: updatedUser.email,
                    name: updatedUser.name,
                    isVerified: updatedUser.isVerified,
                    // verifiedAt: updatedUser.verifiedAt
                }
            });

        } catch (error) {
            console.log("Internal server error", error instanceof Error ? error.message : 'Unknown error');
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async resend_OTP(req: ResendOtpRequest, res: Response): Promise<Response> {
        try {
            const { userId } = req.body;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "User ID is required"
                });
            }

            const user: UserInterface | null = await userModel.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Send new OTP
            const otpSent = await sendOtpEmail(user.email, user);

            if (otpSent) {
                return res.json({
                    success: true,
                    message: "OTP sent successfully"
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: "Failed to send OTP"
                });
            }

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}

export const otpVerification = new OtpVerification();