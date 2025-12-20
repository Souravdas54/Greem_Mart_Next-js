import { model, Schema } from "mongoose";


const userSchema: Schema = new Schema({
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
    password: {
        type: String,
        required: true
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

const userModel = model('User', userSchema);
export { userModel }