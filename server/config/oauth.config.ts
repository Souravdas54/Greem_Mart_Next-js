import dotenv from 'dotenv';
dotenv.config();

import passport from 'passport';
import axios from 'axios';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { userModel } from '../models/User.Model';
import { HydratedDocument } from 'mongoose';
import { UserInterface } from '../interface/User.Interface';
import { roleModel } from '../models/Role.Model';


// ✅ Fail fast if env vars missing
if (!process.env.GOOGLE_CLIENT_ID) throw new Error('GOOGLE_CLIENT_ID is not defined');
if (!process.env.GOOGLE_CLIENT_SECRET) throw new Error('GOOGLE_CLIENT_SECRET is not defined');
if (!process.env.GOOGLE_CALLBACK_URL) throw new Error('GOOGLE_CALLBACK_URL is not defined');

// ── Fetch extra profile data from Google People API ───────────────────────────
interface GooglePeopleData {
    address: string;
    lat: number | null;
    lng: number | null;
    zone: string;
}

async function fetchGooglePeopleData(accessToken: string): Promise<GooglePeopleData> {
    const result: GooglePeopleData = {
        address: '',
        lat: null,
        lng: null,
        zone: '',
    };

    try {
        const { data } = await axios.get('https://people.googleapis.com/v1/people/me',
            {
                params: { personFields: 'addresses,phoneNumber,birthdays' },
                headers: { Authorization: `Bearer ${accessToken}` },
                timeout: 5000,
            }
        )

        const addresses = data?.addresses;
        if (addresses && addresses.length > 0) {
            const addrs = addresses[0];

            result.zone = [
                addrs.streetAddress,
                addrs.city,
                addrs.region,
                addrs.postalcode,
                addrs.country
            ].filter(Boolean).join(', ');

            result.address = result.zone;
        }
    } catch (error: any) {
        console.warn('Google People API error (non-critical):', error?.message || error);
        // const errMsg = 'Google People API error (non-critical)';
        // console.warn(errMsg : error?.message || error)
    }
    return result;
}

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
            // const avatarUrl = profile.photos?.[0]?.value ?? null;
            const avatarUrl = profile.photos?.[0]?.value?.replace('=s96-c', '=s400-c') ?? undefined;

            if (!email) {
                return done(new Error('No email from Google profile'), undefined);
            }

            // ── Fetch address from People API ─────────────────────────
            // Runs in parallel — doesn't block if it fails
            const peopleData = await fetchGooglePeopleData(_accessToken);

            // Check if user already exists
            let user: HydratedDocument<UserInterface> | null = await userModel.findOne({ $or: [{ oauthProviderId }, { email }], });
            // if (user) {
            //     // If user exists but registered locally, link Google
            //     if (!user.oauthProviderId) {
            //         user.oauthProviderId = oauthProviderId;
            //         user.oauthProvider = 'google';
            //         await user.save();
            //     }
            //     return done(null, user as unknown as Express.User)
            // }


            // Resolve default role ObjectId

            if (user) {
                // ── Update existing user with latest Google data ──────
                // Always sync — user may have changed their Google profile
                user.name = name ?? user.name;
                user.avatarUrl = avatarUrl ?? user.avatarUrl;
                user.oauthProvider = 'google';
                user.oauthProviderId = oauthProviderId;
                user.isVerified = true;

                // ✅ Save address only if Google returned one
                if (peopleData.zone) {
                    user.location = {
                        lat: peopleData.lat ?? user.location?.lat ?? 0,
                        lng: peopleData.lng ?? user.location?.lng ?? 0,
                        zone: peopleData.zone,
                    };
                }

                await user.save(); // ✅ persisted to MongoDB
                return done(null, user as unknown as Express.User);
            }

            const role = await roleModel.findOne({ name: 'user' });
            if (!role) {
                return done(
                    new Error("Default role 'user' not found in database"),
                    undefined
                );
            }

            const newUserData: any = {
                name,
                email,
                oauthProviderId,
                oauthProvider: 'google' as const,
                avatarUrl: avatarUrl ?? undefined,
                password: '',
                isVerified: true,
                role: role._id,
            };
            // ✅ Save address if Google returned one
            if (peopleData.zone) {
                newUserData.location = {
                    lat: peopleData.lat ?? 0,
                    lng: peopleData.lng ?? 0,
                    zone: peopleData.zone,
                };
            }

            // Create new user from Google profile
            // user = await userModel.create({
            //     name: profile.displayName,
            //     email,
            //     oauthProviderId,
            //     oauthProvider: 'google' as const,
            //     avatarUrl: avatarUrl ?? undefined,
            //     password: '', // no password for OAuth users
            //     isVerified: true,
            //     role: role._id
            // })

            user = await userModel.create(newUserData);
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