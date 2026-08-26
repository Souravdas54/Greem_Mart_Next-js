import mongoose, { Schema, Document, Types } from "mongoose";
import { PlantInterface } from "../interface/plants.interface";

const CareInstructionsSchema = new Schema(
    {

        light: {
            type: String,
            required: [true, "Light requirement is required"],
            trim: true,
        },
        water: {
            type: String,
            required: [true, "Water requirement is required"],
            trim: true,
        },
        temperature: {
            type: String,
            required: [true, "Temperature requirement is required"],
            trim: true,
        },
    },
    { _id: false }
);

const PlantSchema = new Schema<PlantInterface>(
    {
        name: {
            type: String,
            required: [true, "Plant name is required"],
            trim: true,
            index: true,
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
            // validate: {
            //     validator: function(v: number) {
            //         return v >= 0;
            //     },
            //     message: "Price must be a positive number",
            // },
        },
        originalPrice: {
            type: Number,
            min: [0, "Original price cannot be negative"],
            //  validate: {
            //     validator: function(v: number) {
            //         return !this.originalPrice || this.originalPrice >= this.price;
            //     },
            //     message: "Original price should be greater than or equal to current price",
            // },
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
        images: {
            type: [String],
            required: [true, "Image URL is required"],
            validate: {
                validator: function (v: string[]) {
                    return v && v.length > 0;
                },
                message: "At least one image is required",
            },
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: {
                values: ["indoor", "outdoor", "succulent", "flowering"],
                message: "Category must be one of: indoor, outdoor, succulent, flowering",
            },
            index: true,
        },
        nursery: {
            type: String,
            required: [true, "Nursery name is required"],
            trim: true,
        },
        nurseryId: {
            type: Schema.Types.ObjectId,
            required: [true, "Nursery ID is required"],
            ref: "Nursery",
            index: true,
        },
        inStock: {
            type: Boolean,
            default: true,
            index: true,
        },
        stockQuantity: {
            type: Number,
            default: 0,
            min: [0, "Stock quantity cannot be negative"],
            required: [true, "Stock quantity is required"],
        },
        isNewArrival: {
            type: Boolean,
            default: false,
            index: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
            index: true,
        },
        isPublished: {
            type: Boolean,
            default: true,
            index: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            minlength: [10, "Description must be at least 10 characters"],
            maxlength: [2000, "Description cannot exceed 2000 characters"],
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
        tags: {
            type: [String],
            default: [],
            index: true,
        },
        sizes: {
            type: [String],
            enum: ["small", "medium", "large", "extra-large"],
            default: [],
        },
        colors: {
            type: [String],
            default: [],
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Creator user ID is required"],
            index: true,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
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
PlantSchema.index({ category: 1, inStock: 1, isPublished: 1 });
PlantSchema.index({ nurseryId: 1, createdAt: -1 });
PlantSchema.index({ price: 1 , category:1});
PlantSchema.index({ name: "text", scientificName: "text", description: "text" });
PlantSchema.index({ isFeatured: 1, rating: 1 });
PlantSchema.index({ createdBy: 1, createdAt: -1 });

// Auto-set isNew if createdAt within 30 days
PlantSchema.pre("save", async function () {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const createdAt: Date = (this as any).createdAt ?? new Date();
    (this as any).isNew = createdAt > thirtyDaysAgo;
    // (this as unknown as PlantInterface).isNew = createdAt > thirtyDaysAgo;

});

export const PlantModel = mongoose.model<PlantInterface>("Plant", PlantSchema);