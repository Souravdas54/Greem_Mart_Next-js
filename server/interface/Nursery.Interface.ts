import { Document, Types } from "mongoose";

export interface LocationInterface {
    lat: number;
    lng: number;
    zone?: string;
}

export interface NurseryMetadataInterface {
    climateZones: string[];
    tags: string[];
    description?: string;
    specialties?: string[];
}

export interface NurseryInterface extends Document {
    _id: Types.ObjectId;
    name: string;
    ownerUserId: Types.ObjectId;
    address: string
    location: LocationInterface;
    contact: string;
    currency: string
    isActive: boolean;
    metadata: NurseryMetadataInterface;
    createdAt?: Date;
    updatedAt?: Date;

}

export interface CreateNurseryInterface {
    name: string;
    ownerUserId: Types.ObjectId | string;
    address: string;
    location: LocationInterface;
    contact: string;
    currency: string;
    isActive?: boolean;
    metadata?: Partial<NurseryMetadataInterface>;
}

export interface UpdateNurseryInterface {
    name?: string;
    address?: string;
    location?: LocationInterface;
    contact?: string;
    currency?: string;
    isActive?: boolean;
    metadata?: Partial<NurseryMetadataInterface>;
}