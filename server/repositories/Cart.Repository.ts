import mongoose from "mongoose";
import CartModel, { CartInterface } from "../models/Cart.model";

class CartRepository {

    async findCartByUser(userId: string): Promise<CartInterface[]> {
        try {

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                console.error("Invalid userId format:", userId);
                return [];
            }

            const result = await CartModel.aggregate([
                {
                    $match: { userId: new mongoose.Types.ObjectId(userId) }
                },

                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
                {

                    $lookup: {
                        from: "plants",
                        localField: "plantId",
                        foreignField: '_id',
                        as: 'plant'
                    }
                },
                {
                    $unwind: {
                        path: "$plant",
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        name: 1,
                        'user.name':1,
                        'user.email':1,
                        plantId: 1,
                        quantity: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        plant: 1
                    }
                }
            ])

            console.log(`📦 Found ${result.length} items for user ${userId}`);

            return result;

        } catch (error) {
            console.error("Repository Error - Find cart by user:", error);
            throw error;
        }
    }

    async findItem(userId: string, plantId: string): Promise<CartInterface | null> {
        try {
            return await CartModel.findOne({ userId, plantId })
        } catch (error) {
            console.error("Repository Error - Find one :", error);
            throw error;
        }
    }

    // ADD TO CART 
    async AddOrIncrementItem(userId: string, plantId: string, quantity: number): Promise<CartInterface> {
        try {
            // if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(plantId)) {
            //     throw new Error("Invalid userId or plantId format");
            // }

            const result = await CartModel.findOneAndUpdate(
                { userId, plantId },
                { $inc: { quantity } },
                { upsert: true, returnDocument: 'after' }

            )

            console.log(`✅ Added/incremented item for user ${userId}:`, result);

            return result;

        } catch (error) {
            console.error("Repository Error - ADD or Increment Cart item:", error);
            throw error;
        }
    }

    async UpdateCartItem(userId: string, plantId: string, quantity: number): Promise<CartInterface | null> {
        try {
            return await CartModel.findOneAndUpdate(
                { userId, plantId },
                { quantity },
                { returnDocument: 'after' }
            );

        } catch (error) {
            console.error("Repository Error - Update Cart item:", error);
            throw error;
        }
    }

    async removeItem(userId: string, plantId: string): Promise<CartInterface | null> {
        try {
            return await CartModel.findOneAndDelete({ userId, plantId });
        } catch (error) {
            console.error("Repository Error - Remove Cart item:", error);
            throw error;
        }
    }

    async clearCart(userId: string): Promise<{ deletedCount?: number }> {
        try {
            return await CartModel.deleteMany({ userId });
        } catch (error) {
            console.error("Repository Error - Clear Cart item:", error);
            throw error;
        }
    }
}

const cartRepository = new CartRepository();
export { cartRepository }