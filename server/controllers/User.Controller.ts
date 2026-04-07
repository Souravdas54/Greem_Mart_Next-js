import { Request, Response } from 'express';
import { userRepositories } from "../repositories/User.Repositories";
import { UserValidation } from "../validation/User.Validation";
import { CreateUserInput, LoginInput, UpdateUserInput, UserInterface } from "../interface/User.Interface";

import bcrypt from 'bcryptjs';
import { roleModel } from "../models/Role.Model";
import { TokenService } from "../service/Token.Service";
import { emailService } from "../service/email.service";
import { sendOtpEmail } from "../service/send.otpmail.service";
import cloudinary from '../config/cloudinaryConfig';
import { GeocodingService } from "../service/geocoding.service";

class UserController {
    async register(req: Request, res: Response): Promise<any> {
        try {

            // Validate input
            const { error, value } = UserValidation.signup.validate(req.body);
            if (error) {
                console.log("Validation error:", error.message);
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            // Check if user already exists
            const existingUser = await userRepositories.findByEmail(value.email);
            if (existingUser) {
                console.log("Email already exists:", value.email);


                if (req.file && (req.file as any).filename) {
                    const publicId = (req.file as any).filename; //this is Cloudinary public_id

                    try {
                        await cloudinary.uploader.destroy(publicId);
                        console.log("Image deleted from Cloudinary:", publicId);
                    } catch (err) {
                        console.log("Failed to delete image from Cloudinary:", err);
                    }
                }

                return res.status(400).json({
                    success: false,
                    message: "Email already registered"
                });
            }

            let avatarUrl = "";
            if (req.file) {
                // Cloudinary returns the file object with secure_url
                avatarUrl = (req.file as any).secure_url || (req.file as any).path;
                console.log("Profile picture uploaded successfully:", avatarUrl);
                console.log("Full file object:", req.file);
            } else {
                console.log("No file received. Check multer configuration.");
                console.log("Request headers:", req.headers['content-type']);
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(value.password, salt);
            console.log("🔐 Password hashed successfully");

            // Set default role if not provided
            if (!value.role) {
                value.role = 'user';
                console.log("Default role assigned: user");
            }

            // Create user data object
            const userData: CreateUserInput = {
                name: value.name,
                email: value.email,
                password: hashedPassword,
                location: value.location,
                avatarUrl: avatarUrl,
                isVerified: false,
                role: value.role
            };

            // Add optional fields
            if (value.location) {
                userData.location = value.location;
            }
            if (value.nurseryId) {
                userData.nurseryId = value.nurseryId;
            }

            // console.log("💾 Saving user data:", userData);

            // Save user to database
            const newUser = await userRepositories.save(userData);

            if (!newUser) {
                console.log("Failed to create user in database");
                return res.status(500).json({
                    success: false,
                    message: "Failed to create user"
                });
            }

            console.log("User created successfully with ID:", newUser._id);

            // Convert to UserInterface
            const user = newUser as unknown as UserInterface;

            // Send OTP email for verification
            try {

                const otpSent = await sendOtpEmail(newUser.email as string, user);

                if (!otpSent) {
                    console.log('⚠️ Account created but OTP email sending failed');
                } else {
                    console.log('✅ OTP email sent successfully');
                }
            } catch (emailError) {
                console.log('⚠️ OTP email service error:', emailError);
            }

            // Send verification email
            // try {
            //     const emailResult = await emailService.sendWelcomeEmail(
            //         user.email,
            //         user.name,
            //     );

            //     if (!emailResult.success) {
            //         console.log('⚠️ Account created but email sending failed:', emailResult.error);
            //     } else {
            //         console.log('✅ Wellcome email sent successfully');
            //     }
            // } catch (emailError) {
            //     console.log('⚠️ Email service error:', emailError);
            // }

            // Prepare response data (exclude password)
            const userResponse = {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                avatarUrl: newUser.avatarUrl,
                isVerified: newUser.isVerified,
                role: newUser.role,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            };

            return res.status(201).json({
                success: true,
                message: "Registration successful. Please verify your email.",
                data: userResponse
            });

        } catch (error: any) {
            console.log("Registration error:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async login(req: Request, res: Response): Promise<Response> {
        try {
            const loginData: LoginInput = {
                email: req.body.email,
                password: req.body.password,
            };

            const { error, value } = UserValidation.login.validate(loginData);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            const userData = await userRepositories.findByEmail(value.email) as UserInterface;
            if (!userData) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            if (userData.isVerified === false) {
                return res.status(403).json({
                    success: false,
                    message: "Please verify your email before logging in"
                });
            }

            const isPasswordMatch = await bcrypt.compare(value.password, userData.password);
            if (!isPasswordMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid password"
                });
            }

            // Get role name
            let roleName: string;
            if (typeof userData.role === 'string') {
                roleName = userData.role;
            } else {
                const roleDoc = await roleModel.findById(userData.role);
                if (!roleDoc) {
                    return res.status(500).json({
                        success: false,
                        message: "Role not found"
                    });
                }
                roleName = roleDoc.name;
            }

            // Generate tokens
            const accessToken = TokenService.generateAccessToken(userData, roleName);
            const refreshToken = TokenService.generateRefreshToken(userData, roleName);

            await userRepositories.updateRefreshToken(userData._id.toString(), refreshToken);

            // Prepare user response without password
            const userResponse = {
                _id: userData._id,
                name: userData.name,
                email: userData.email,
                avatarUrl: userData.avatarUrl,
                isVerified: userData.isVerified,
                role: roleName,
                createdAt: userData.createdAt,
                updatedAt: userData.updatedAt
            };

            let cookiePrefix = 'user';
            if (roleName === 'super_admin') {
                cookiePrefix = 'super_admin';
            } else if (roleName === 'nursery_admin') {
                cookiePrefix = 'nursery_admin';
            }

            res.cookie(`${cookiePrefix}AccessToken`, accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 60 * 60 * 1000
            });

            res.cookie(`${cookiePrefix}RefreshToken`, refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000
            });

            res.cookie(`${cookiePrefix}AccessTokenExpires`, process.env.JWT_ACCESS_EXPIRES_IN || '1h', {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000
            });

            res.cookie(`${cookiePrefix}RefreshTokenExpires`, process.env.JWT_REFRESH_EXPIRES_IN || '1d', {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000
            });


            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: userResponse,
                tokens: {
                    accessToken,
                    refreshToken,
                    accessTokenExpires: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
                    refreshTokenExpires: process.env.JWT_REFRESH_EXPIRES_IN || '1d'
                }
            });

        } catch (error: any) {
            console.log("Login error:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }

    async refreshToken(req: Request, res: Response): Promise<Response> {
        try {
            // Get refresh token from cookies or body
            const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

            if (!refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: "Refresh token is required"
                });
            }

            // Find user by refresh token
            const user = await userRepositories.findByRefreshToken(refreshToken) as UserInterface;
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid refresh token"
                });
            }

            // Verify refresh token
            const decoded = TokenService.verifyRefreshToken(refreshToken);

            // Get role name
            let roleName: string;
            const roleDoc = await roleModel.findById(user.role);
            if (!roleDoc) {
                roleName = 'user';
            } else {
                roleName = roleDoc.name;
            }

            // Generate new tokens
            const newAccessToken = TokenService.generateAccessToken(user, roleName);
            const newRefreshToken = TokenService.generateRefreshToken(user, roleName);

            // Update refresh token in database
            await userRepositories.updateRefreshToken(user._id.toString(), newRefreshToken);

            // Set new refresh token in cookie
            const cookiePrefix = roleName === 'super_admin' ? 'super_admin' :
                roleName === 'nursery_admin' ? 'nursery_admin' : 'user';

            res.cookie(`${cookiePrefix}RefreshToken`, newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'development',
                sameSite: process.env.NODE_ENV === 'development' ? 'strict' : 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            return res.status(200).json({
                success: true,
                message: "Tokens refreshed successfully",
                data: {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                    accessTokenExpires: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
                    refreshTokenExpires: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
                }
            });

        } catch (error: any) {
            console.error("Refresh Token Error:", error.message);
            return res.status(401).json({
                success: false,
                message: "Invalid or expired refresh token"
            });
        }
    }

    async getUserwithId(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const user = await userRepositories.getUserById(id) as UserInterface;

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            let roleName = 'user';
            if (user.role) {
                try {
                    // Get role name
                    const roleDoc = await roleModel.findById(user.role);
                    const roleName = roleDoc?.name || 'user';
                } catch (error) {
                    console.error("Role fetch error:", error);
                }
            }

            // Prepare response data (exclude sensitive information)
            const userResponse = {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatarUrl: user.avatarUrl,
                isVerified: user.isVerified,
                role: roleName,
                roleId: user.role,
                location: user.location,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };

            return res.status(200).json({
                success: true,
                message: "User fetched successfully",
                data: userResponse,
            });
        } catch (error: any) {
            console.error("Get user by ID error:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async updateProfile(req: Request, res: Response): Promise<Response> {
        try {
            const userId = (req.user as any)?.userId || req.params.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "User not authenticated"
                });
            }

            // Validate input
            const { error, value } = UserValidation.updateProfile.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            // Prepare update data
            const updateData: UpdateUserInput = {};
            if (value.name !== undefined) updateData.name = value.name;

            // Handle location if provided
            if (value.location !== undefined) {
                if (typeof value.location === 'string') {
                    // It's a zone name like "Kolkata"
                    const coordinates = await GeocodingService.geocodeLocation(value.location);

                    if (coordinates) {
                        updateData.location = {
                            lat: coordinates.lat,
                            lng: coordinates.lng,
                            zone: value.location
                        };
                    } else {
                        updateData.location = value.location;
                    }
                } else {
                    updateData.location = value.location;
                }
            }

            // Handle avatar/ profile picture
            let newAvatarUrl: string | undefined;
            if (req.file) {
                newAvatarUrl = (req.file as any).secure_url || (req.file as any).path;
            } else if (value.avatarUrl !== undefined) {
                newAvatarUrl = value.avatarUrl;
            }

            // Update user
            const updatedUser = await userRepositories.updateUser(
                userId,
                updateData,
                newAvatarUrl
            ) as UserInterface;

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Get role name
            const roleDoc = await roleModel.findById(updatedUser.role);
            const roleName = roleDoc?.name || 'user';

            // Prepare response
            const userResponse = {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                avatarUrl: updatedUser.avatarUrl,
                isVerified: updatedUser.isVerified,
                role: roleName,
                location: updatedUser.location,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            };

            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                data: userResponse
            });

        } catch (error: any) {
            console.error('Update profile error:', error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async logout(req: Request, res: Response): Promise<Response> {
        try {
            const userId = (req.user as any)?.userId;

            if (userId) {
                await userRepositories.updateRefreshToken(userId, null);
            }

            const sameSiteValue: 'strict' | 'lax' = process.env.NODE_ENV === 'production' ? 'strict' : 'lax';

            // Clear all possible cookies based on role
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'development',
                sameSite: sameSiteValue,
                path: '/'
            };

            // Clear all possible token cookies
            const cookiesToClear = [
                'super_adminAccessToken', 'super_adminRefreshToken',
                'nursery_adminAccessToken', 'nursery_adminRefreshToken',
                'userAccessToken', 'userRefreshToken',
                'accessToken', 'refreshToken', 'token', 'authToken'
            ];

            cookiesToClear.forEach(cookieName => {
                res.clearCookie(cookieName, cookieOptions);
            });

            // Set cache control headers
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');

            // Log the logout
            console.log(`User ${userId || 'unknown'} logged out successfully`);

            return res.status(200).json({
                success: true,
                message: "Logged out successfully"
            });

        } catch (error: any) {
            console.error("Logout Error:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async forgotPassword(req: Request, res: Response): Promise<Response> {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: "Email is required"
                });
            }

            // Find user by email
            const user = await userRepositories.findByEmail(email);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User with this email does not exist"
                });
            }

            // Send OTP email for verification
            try {

                const otpSent = await sendOtpEmail(user.email as string, user);

                if (!otpSent) {
                    console.log('⚠️ Account created but OTP email sending failed');
                } else {
                    console.log('✅ OTP email sent successfully');
                }
            } catch (emailError) {
                console.log('⚠️ OTP email service error:', emailError);
            }

            return res.status(200).json({
                success: true,
                message: "OTP sent successfully to your email",
                userId: user._id // Send userId for the next step
            });

        } catch (error) {
            console.error("Forgot password error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    async resetPassword(req: Request, res: Response): Promise<Response> {
        try {
            // Validate request body
            const { error, value } = UserValidation.resetPassword.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                });
            }

            const { userId, newPassword } = value;

            // Find user by reset token
            const user = await userRepositories.getUserById(userId);

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update user password
            await userRepositories.updateUserPassword(user._id.toString(), hashedPassword);

            // Clear reset token
            // await userRepositories.clearResetToken(user._id.toString());

            // Send password reset confirmation email
            try {
                // Get user name (assuming you have a name field, otherwise use email)
                const userName = (user as any).name || user.email.split('@')[0];

                const emailSent = await emailService.sendPasswordResetConfirmationEmail(user.email, userName);

                if (!emailSent.success) {
                    console.log('⚠️ Password reset confirmation email failed to send:', emailSent.error);
                } else {
                    console.log('✅ Password reset confirmation email sent successfully');
                }
            } catch (emailError) {
                // Don't fail the password reset if email fails
                console.error('⚠️ Password reset confirmation email error:', emailError);
            }

            return res.status(200).json({
                success: true,
                message: "Password reset successfully. You can now login with your new password."
            });

        } catch (error) {
            console.error("Reset password error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

}

export const userController = new UserController();