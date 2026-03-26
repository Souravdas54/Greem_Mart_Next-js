import mongoose, { Schema, Document, Types } from "mongoose";
import { PlantInterface } from "../interface/plants.interface";

const CareInstructionsSchema = new Schema(
    {
        light: { type: String, required: true },
        water: { type: String, required: true },
        temperature: { type: String, required: true },
    },
    { _id: false }
);

const PlantSchema = new Schema<PlantInterface>(
    {
        name: {
            type: String,
            required: [true, "Plant name is required"],
            trim: true,
        },
        scientificName: {
            type: String,
            required: [true, "Scientific name is required"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },
        originalPrice: {
            type: Number,
            min: [0, "Original price cannot be negative"],
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviews: {
            type: Number,
            default: 0,
            min: 0,
        },
        image: {
            type: String,
            required: [true, "Image URL is required"],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: {
                values: ["indoor", "outdoor", "succulent", "flowering"],
                message: "Category must be one of: indoor, outdoor, succulent, flowering",
            },
        },
        nursery: {
            type: String,
            required: [true, "Nursery name is required"],
            trim: true,
        },
        nurseryId: {
            type: Number,
            required: [true, "Nursery ID is required"],
        },
        inStock: {
            type: Boolean,
            default: true,
        },
        isNew: {
            type: Boolean,
            default: false,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        careInstructions: {
            type: CareInstructionsSchema,
            required: [true, "Care instructions are required"],
        },
        discount: {
            type: Number,
            min: [0, "Discount cannot be negative"],
            max: [100, "Discount cannot exceed 100%"],
        },
        createdBy: {
            type: Number,
            required: [true, "Creator user ID is required"],
        },
        updatedBy: {
            type: Number,
            required: [true, "Updater user ID is required"],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for performance
PlantSchema.index({ category: 1 });
PlantSchema.index({ nurseryId: 1 });
PlantSchema.index({ price: 1 });
PlantSchema.index({ name: "text", scientificName: "text", description: "text" });
PlantSchema.index({ isFeatured: 1, inStock: 1 });

// Auto-set isNew if createdAt within 30 days
PlantSchema.pre("save", function (next) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const createdAt: Date = (this as any).createdAt ?? new Date();
    (this as unknown as PlantInterface).isNew = createdAt > thirtyDaysAgo;
    next();
});

export const PlantModel = mongoose.model<PlantInterface>("Plant", PlantSchema);