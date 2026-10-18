import mongoose, { Document, Schema } from "mongoose";

export interface WhishlistIterface extends Document {
    userId: mongoose.Types.ObjectId;
    plantId: mongoose.Types.ObjectId;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}

const WhishlistSchema: Schema = new Schema<WhishlistIterface>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true
    },
    plantId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Plant"
    },
    quantity: {
        type: Number,
        default: 1,

    }
}, {
    timestamps: true
});

WhishlistSchema.index({ userId: 1, plantId: 1 }, { unique: true });

export default mongoose.model<WhishlistIterface>("Whishlist", WhishlistSchema)