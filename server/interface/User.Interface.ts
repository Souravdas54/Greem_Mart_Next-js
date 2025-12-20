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
    password: string;
    role: Types.ObjectId;
    nurseryId?: Types.ObjectId;
    avatarUrl?: string;
    location?: LocationInterface | string;
    isVerified?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
    role?: 'super_admin' | 'nursery_admin' | 'user';
    nurseryId?: string;
    avatarUrl?: string;
    location?: LocationInterface | string;
    isVerified?: boolean;
}

export interface UpdateUserInput {
    name?: string;
    avatarUrl?: string;
    location?: LocationInterface | string;
    nurseryId?: string | null;

}

export interface LoginInput {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: UserInterface;
    token: string;
}