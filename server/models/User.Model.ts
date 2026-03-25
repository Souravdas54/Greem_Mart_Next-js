import { model, Schema } from "mongoose";
import { UserInterface } from "../interface/User.Interface";

const userSchema: Schema = new Schema<UserInterface>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    oauthProvider: {
        type: String,
        enum: ['google', 'github', 'facebook', 'apple'],
        default: null
    },
    oauthProviderId: {
        type: String,
        default: null,
        sparse: true,  // Allows null values but enforces uniqueness for non-null
    },
    password: {
        type: String,
        required: false,
        default: null
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
    },
    nurseryId: {
        type: Schema.Types.ObjectId,
        ref: 'Nursery',
        default: null
    },
    avatarUrl: {
        type: String,
        default: null
    },
    location: {
        lat: { type: Number, min: -90, max: 90 },
        lng: { type: Number, min: -180, max: 180 },
        zone: { type: String, trim: true }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false,
});

//  Correct the index field name
userSchema.index({ oauthProvider: 1, oauthProviderId: 1 }, {
    unique: true,
    partialFilterExpression: { oauthProvider: { $ne: null }, oauthProviderId: { $ne: null } }
});

const userModel = model<UserInterface>('User', userSchema);
export { userModel }