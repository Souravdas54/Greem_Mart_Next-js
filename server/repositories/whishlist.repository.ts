import mongoose from "mongoose";
import WhishlistModel, { WhishlistIterface } from "../models/whishlist.model";

class WhishlistRepository {

    async CreateWhishlist(userId: string, plantId: string, quantity: number): Promise<WhishlistIterface> {
        try {
            const result = await WhishlistModel.findOneAndUpdate(
                { userId, plantId },
                { $inc: { quantity } },
                { upsert: true, returnDocument: 'after' }

            )

            console.log(`✅ Added Whishlist item for user ${userId}:`, result);

            return result;
        } catch (error) {
            console.error("Repository Error - Whishlist item:", error);
            throw error;
        }
    }

    async findUserById(userId: string): Promise<WhishlistIterface[]> {
        try {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                console.error("Invalid userId format : ", userId);
                return [];
            }

            const result = await WhishlistModel.aggregate([
                {
                    $match: { userId: new mongoose.Types.ObjectId(userId) }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: 'user'
                    }
                },
                {
                    $unwind: {
                        path: "$users",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "plants",
                        localField: "plantId",
                        foreignField: "_id",
                        as: 'plant'
                    }
                },
                {
                    $unwind: {
                        path: "$plants",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        'user.name': 1,
                        'user.email': 1,
                        plantId: 1,
                        quantity: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        plant: 1
                    }
                }
            ])

            return result;

        } catch (error) {
            console.error("Repository Error - Find whishlist by user:", error);
            throw error;
        }
    }

    async RemoveWhishlist(userId: string, plantId: string): Promise<boolean> {
        try {
            const result = await WhishlistModel.deleteOne({ userId, plantId });
            return result.deletedCount > 0;
        } catch (error) {
            console.error("Repository Error - Remove whishlist item:", error);
            throw error;
        }
    }
}

const whishlistRepository = new WhishlistRepository();
export { whishlistRepository }