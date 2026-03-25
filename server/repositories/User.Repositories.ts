import { roleModel } from "../models/Role.Model";
import { userModel } from "../models/User.Model";
import { CreateUserInput, UpdateUserInput, UserInterface } from "../interface/User.Interface";
import cloudinary from "../config/cloudinaryConfig";
import { Types } from "mongoose";

class UserRepositories {

    async save(userData: CreateUserInput): Promise<UserInterface> {
        try {
            const roleName = userData.role || 'user';

            const roleDoc = await roleModel.findOne({ name: userData.role });
            if (!roleDoc) throw new Error("Invalid role");

            // Check if nurseryId is being set for non-nursery_admin
            const isNurseryAdmin = roleName === 'nursery_admin';

            // Validate nurseryId based on role
            if (isNurseryAdmin) {
                // nursery_admin MUST have a nurseryId
                if (!userData.nurseryId) {
                    throw new Error('nursery_admin must have a nurseryId');
                }
            } else {
                // super_admin and user should NOT have nurseryId
                // Remove nurseryId if provided
                delete userData.nurseryId;
            }

            const { nurseryId, ...userDataWithoutNurseryId } = userData;

            const userToCreate: any = {
                name: userDataWithoutNurseryId.name,
                email: userDataWithoutNurseryId.email,
                password: userDataWithoutNurseryId.password,
                avatarUrl: userDataWithoutNurseryId.avatarUrl || null,
                isVerified: userDataWithoutNurseryId.isVerified || false,
                role: roleDoc._id
            };
            if (isNurseryAdmin && nurseryId) {
                userToCreate.nurseryId = new Types.ObjectId(nurseryId);
            }

            // Create user data with proper role ObjectId
            // const userToCreate: any = {
            //     name: userData.name,
            //     email: userData.email,
            //     password: userData.password,
            //     avatarUrl: userData.avatarUrl || null,
            //     isVerified: userData.isVerified,
            //     role: roleDoc._id
            // };

            // Only add nurseryId for nursery_admin
            // if (isNurseryAdmin && userData.nurseryId) {
            //     userToCreate.nurseryId = new Types.ObjectId(userData.nurseryId);
            // }

            const newDataCreate = await userModel.create(userToCreate);
            return newDataCreate as unknown as UserInterface;

        } catch (error) {
            console.log("Repository Error - save:", error);
            throw error;
        }
    }

    async findByEmail(email: string): Promise<UserInterface | null> {
        try {
            const findEmailId = await userModel.findOne({ email });
            return findEmailId as unknown as UserInterface | null;

        } catch (error) {
            console.log("Repository Error - findByEmail:", error);
            throw error;
        }
    }

    async getUserById(id: string): Promise<UserInterface | null> {
        try {
            const getuser = await userModel.findById(id).select('-password').lean();
            if (!getuser) {
                return null;
            }
            return getuser as unknown as UserInterface;

        } catch (error) {
            console.log("Repository Error - getUserById:", error);
            throw error;
        }
    }

    //update a profile
    async updateUser(id: string, data: UpdateUserInput, newAvatarUrl?: string): Promise<UserInterface | null> {
        try {
            const user = await userModel.findById(id);
            if (!user) return null;

            // Get user's role name
            const roleDoc = await roleModel.findById(user.role);
            const isNurseryAdmin = roleDoc?.name === 'nursery_admin';

            // Handle nurseryId update based on role
            if (data.nurseryId !== undefined) {
                if (isNurseryAdmin) {
                    // nursery_admin must have nurseryId
                    if (!data.nurseryId) {
                        throw new Error('nursery_admin must have a nurseryId');
                    }
                    // user.nurseryId = new Types.ObjectId(data.nurseryId);
                    user.set('nurseryId', new Types.ObjectId(data.nurseryId));
                } else {
                    // Remove nurseryId for non-nursery_admin
                    // user.nurseryId = null;
                    user.set('nurseryId', null);

                    // Also remove from data to prevent any issues
                    delete data.nurseryId;
                }
            }

            // Update basic fields
            if (data.name) user.name = data.name;

            // Update location if provided
            if (data.location !== undefined) {
                if (typeof data.location === 'string') {
                    // If location is a string (zone name only)
                    user.location = {
                        lat: 0, // Provide default value
                        lng: 0, // Provide default value
                        zone: data.location as string
                        // lat and lng remain undefined
                    };
                } else {
                    user.location = {
                        lat: data.location.lat,
                        lng: data.location.lng,
                        ...(data.location.zone && { zone: data.location.zone })
                    };
                }

            }

            // Update avatar URL (profile picture)
            if (newAvatarUrl && typeof newAvatarUrl === "string") {
                const oldAvatarUrl = user.avatarUrl;

                // Delete old image from cloudinary if it exists
                if (oldAvatarUrl && typeof oldAvatarUrl === 'string') {
                    try {
                        // Extract public_id from Cloudinary URL
                        const urlParts: string[] = oldAvatarUrl.split('/');
                        const fileNameWithExtension = urlParts[urlParts.length - 1];
                        const publicId = `green mart/${fileNameWithExtension.split('.')[0]}`;

                        await cloudinary.uploader.destroy(publicId);
                        console.log("Old avatar deleted from Cloudinary:", publicId);
                    } catch (cloudinaryError) {
                        console.warn("Failed to delete old avatar from Cloudinary:", cloudinaryError);
                        // Continue even if deletion fails
                    }
                }

                user.avatarUrl = newAvatarUrl;
            }

            const updatedUser = await user.save();
            return updatedUser as unknown as UserInterface;

        } catch (error: any) {
            console.error("Repository Error - updateUser:", error.message);

            // Optional: Clean up uploaded file if error occurs
            if (newAvatarUrl) {
                try {
                    const urlParts = newAvatarUrl.split('/');
                    const fileNameWithExtension = urlParts[urlParts.length - 1];
                    const publicId = `green mart/${fileNameWithExtension.split('.')[0]}`;
                    await cloudinary.uploader.destroy(publicId);
                } catch (cleanupError) {
                    console.warn("Failed to cleanup uploaded avatar on error:", cleanupError);
                }
            }

            throw error;
        }
    }


    async updateRefreshToken(id: string, refreshToken: string | null): Promise<UserInterface | null> {
        try {
            const user = await userModel.findByIdAndUpdate(
                id,
                { refreshToken },
                { new: true }
            );
            return user as unknown as UserInterface | null;
        } catch (error) {
            console.log("Repository Error - updateRefreshToken:", error);
            throw error;
        }
    }

    async findByRefreshToken(refreshToken: string): Promise<UserInterface | null> {
        try {
            const user = await userModel.findOne({ refreshToken }).populate('role');
            return user as unknown as UserInterface | null;

        } catch (error) {
            console.log("Repository Error - findByRefreshToken:", error);
            throw error;
        }
    }
}

const userRepositories = new UserRepositories();
export { userRepositories };