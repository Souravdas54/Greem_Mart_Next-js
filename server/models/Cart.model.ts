import mongoose, { Document, Schema, Types } from "mongoose";

export interface CartInterface extends Document {
    userId: mongoose.Types.ObjectId;
    plantId: mongoose.Types.ObjectId;
    quantity: number
    createdAt: Date;
    updatedAt: Date;
}

const CartSchema: Schema = new Schema<CartInterface>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
        index: true
    },
    plantId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Plant"
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    }
}, {
    timestamps: true
});

CartSchema.index({ userId: 1, plantId: 1 }, { unique: true });

export default mongoose.model<CartInterface>('CartItem', CartSchema);