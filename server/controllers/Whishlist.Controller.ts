import { Request, Response } from "express";
import { whishlistRepository } from "../repositories/whishlist.repository";
import { addToWishlistSchema } from "../validation/Cart.and.Wishlist.Validation";

class WhishlistController {

    async addTowishlist(req: Request, res: Response) {
        try {

            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    message: "User not authenticated"
                })
            }

            const { error, value } = addToWishlistSchema.validate(req.body)
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                })
            }

            const { plantId, quantity } = value;

            const item = await whishlistRepository.CreateWhishlist(userId, plantId, quantity ?? 1)

            return res.status(200).json({
                success: true,
                message: "Item added to wishlist",
                data: item
            });

        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to add item to wishlist",
            });
        }

    }
    async getWishlist(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    message: "User not authenticated"
                })
            }

            const wishlist = await whishlistRepository.findUserById(userId);

            return res.status(200).json({
                success: true,
                total: wishlist.length,
                data: wishlist
            })
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to get wishlist",
            });
        }
    }

    async removeFromWishlist(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "User not authenticated"
                });
            }

            const { plantId } = req.params;
            if (!plantId) {
                return res.status(400).json({ success: false, message: "plantId param is required" });
            }

            const removed = await whishlistRepository.RemoveWhishlist(userId, plantId);

            if (!removed) {
                return res.status(404).json({
                    success: false,
                    message: "Item not found in wishlist"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Item removed from wishlist"
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to remove item from wishlist",
            });
        }
    }

}

export const whishlistController = new WhishlistController();

