import { userModel } from "../models/User.Model";
import { UserInterface } from "../interface/User.Interface";
import { HydratedDocument } from "mongoose";
import { roleModel } from "../models/Role.Model";

class OAuthRepositories {

    async findByOauthOrEmail(oauthProviderId: string, email: string): Promise<HydratedDocument<UserInterface> | null> {
        return userModel.findOne({
            $or: [{ oauthProviderId }, { email }]
        })
    }

    async findById(id: string): Promise<HydratedDocument<UserInterface> | null> {
        return userModel.findById(id);
    }

    async linkOAuthProvider(userId: string, oauthProviderId: string, oauthProvider: 'google' | 'github' | 'facebook' | 'apple'): Promise<HydratedDocument<UserInterface> | null> {
        return userModel.findByIdAndUpdate(userId,
            {
                $set: {
                    oauthProvider,
                    oauthProviderId,
                    isVerified: true
                }
            },
            { new: true }
        )
    }

    async createOAuthUser(data: {
        name: string;
        email: string;
        oauthProviderId: string;
        oauthProvider: 'google' | 'github' | 'facebook' | 'apple';
        avatarUrl?: string;
    }): Promise<HydratedDocument<UserInterface>> {

        // ✅ Resolve 'user' role ObjectId from Role model
        const role = await roleModel.findOne({ name: 'user' });
        if (!role) {
            throw new Error("Default role 'user' not found in database");
        }

        return userModel.create({
            name: data.name,
            email: data.email,
            oauthProviderId: data.oauthProviderId,
            oauthProvider: data.oauthProvider,
            avatarUrl: data.avatarUrl ?? undefined,
            password: '',           // No password for OAuth users
            isVerified: true,       // Google already verified the email
            role: role._id          // ✅ ObjectId from Role model
        });
    }

    // ── Get current user by token payload userId
    async findByIdWithRole(id: string): Promise<HydratedDocument<UserInterface> | null> {
        return userModel.findById(id) as unknown as Promise<HydratedDocument<UserInterface> | null>;
    }

    // Save refreshToken to DB after login
    async saveRefreshToken(
        userId: string,
        refreshToken: string
    ): Promise<void> {
        await userModel.findByIdAndUpdate(userId, {
            $set: { refreshToken }
        });
    }

    // Clear refreshToken on logout
    async clearRefreshToken(
        userId: string
    ): Promise<void> {
        await userModel.findByIdAndUpdate(userId, {
            $set: { refreshToken: '' }
        });
    }


}

export const oauthRepositories = new OAuthRepositories();