import mongoose, { Document, Schema, Types } from "mongoose";

export interface Roleinterface extends Document {
    _id: Types.ObjectId,
    name: "super_admin" | "nursery_admin" | "user",
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const RoleSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            enum: ['super_admin', 'nursery_admin', 'user']
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export const roleModel = mongoose.models.Role || mongoose.model<Roleinterface>('Role', RoleSchema);