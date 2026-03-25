import dotenv from 'dotenv';
dotenv.config();

import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { userModel } from '../models/User.Model';
import { HydratedDocument } from 'mongoose';
import { UserInterface } from '../interface/User.Interface';
import { roleModel } from '../models/Role.Model';


// ✅ Fail fast if env vars missing
if (!process.env.GOOGLE_CLIENT_ID) throw new Error('GOOGLE_CLIENT_ID is not defined');
if (!process.env.GOOGLE_CLIENT_SECRET) throw new Error('GOOGLE_CLIENT_SECRET is not defined');
if (!process.env.GOOGLE_CALLBACK_URL) throw new Error('GOOGLE_CALLBACK_URL is not defined');


// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
},
    async (_accessToken, _refreshToken, profile: Profile, done) => {
        // Your logic here
        try {
            const email = profile.emails?.[0]?.value;
            const oauthProviderId = profile.id;
            const name = profile.displayName;
            const avatarUrl = profile.photos?.[0]?.value ?? null;

            if (!email) {
                return done(new Error('No email from Google profile'), undefined);
            }

            // Check if user already exists
            let user: HydratedDocument<UserInterface> | null = await userModel.findOne({ $or: [{ oauthProviderId }, { email }], });
            if (user) {
                // If user exists but registered locally, link Google
                if (!user.oauthProviderId) {
                    user.oauthProviderId = oauthProviderId;
                    user.oauthProvider = 'google';
                    await user.save();
                }
                return done(null, user as unknown as Express.User)
            }

            // Resolve default role ObjectId
            const role = await roleModel.findOne({ name: 'user' });
            if (!role) {
                return done(
                    new Error("Default role 'user' not found in database"),
                    undefined
                );
            }

            // Create new user from Google profile
            user = await userModel.create({
                name: profile.displayName,
                email,
                oauthProviderId,
                oauthProvider: 'google' as const,
                avatarUrl: avatarUrl ?? undefined,
                password: '', // no password for OAuth users
                isVerified: true,
                role: role._id
            })
            return done(null, user as unknown as Express.User);

        } catch (error) {
            return done(error as Error, undefined);
        }
    }
)
);

passport.serializeUser((user: any, done) => {
    // done(null, user._id)
    done(null, (user as UserInterface)._id);
})

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user as unknown as Express.User | null)
    } catch (error) {
        done(error, null)
    }
})

export default passport;