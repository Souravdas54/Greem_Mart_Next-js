import { Types, Document } from 'mongoose';

export interface LocationInterface {
    lat: number;
    lng: number;
    zone?: string;
}

export interface UserInterface extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    oauthProvider?: 'google' | 'github' | 'facebook' | 'apple' | null;
    oauthProviderId?: string | null;
    password: string;
    role: Types.ObjectId;
    nurseryId?: Types.ObjectId;
    avatarUrl?: string;
    location?: LocationInterface;
    isVerified?: boolean;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserInput {
    name: string;
    email: string;
    oauthProvider?: 'google' | 'github' | 'facebook' | 'apple' | null;
    oauthProviderId?: string | null;
    password?: string;
    role?: 'super_admin' | 'nursery_admin' | 'user';
    nurseryId?: string;
    avatarUrl?: string;
    location?: LocationInterface;
    isVerified?: boolean;
}

export interface UpdateUserInput {
    name?: string;
    avatarUrl?: string;
    location?: LocationInterface;
    nurseryId?: string | null;

}

export interface LoginInput {
    email: string;
    password: string;
    oauthProvider?: 'google' | 'github' | 'facebook' | 'apple' | null;
    oauthProviderId?: string | null;
}

export interface AuthResponse {
    user: UserInterface;
    // token: string;
    accessToken: string;
    refreshToken: string;
}