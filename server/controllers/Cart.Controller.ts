import { Request, Response } from "express";
import { cartRepository } from "../repositories/Cart.Repository";
import { addToCartSchema, updateCartItemSchema } from "../validation/Cart.and.Wishlist.Validation";
import { AuthenticatedRequest } from "../interface/Cart.interface";

class CartController {

    async getCart(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "User not authenticated"
                });
            }
            console.log("getCart called by:", req.user);

            const cart = await cartRepository.findCartByUser(userId)
            
            return res.status(200).json({
                success: true,
                total: cart.length,
                data: cart
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to get cart",
            });
        }
    }

    async getCartById(req: Request, res: Response): Promise<Response> {
        try {
            const authRole = req.user?.role;
            const { id: targetUserId } = req.params;


            if (!targetUserId) {
                return res.status(400).json({ success: false, message: "userId param is required" });
            }

            const isRole = authRole === 'super_admin' || authRole === 'nursery_admin' || authRole === 'user';

            if (!isRole) {
                return res.status(403).json({ success: false, message: "Not authorized to view this cart" });
            }

            const cart = await cartRepository.findCartByUser(targetUserId);

            return res.status(200).json({
                success: true,
                total: cart.length,
                data: cart, isRole
            });

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Failed to get cart",
                error
            });
        }
    }

    async addToCart(req: Request, res: Response) {
        try {
            const userId = req.user?.userId || req.body.userId;;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "User not authenticated"
                });
            }

            const { error, value } = addToCartSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, message: error.details[0].message });
            }

            const { plantId, quantity } = value;
            const item = await cartRepository.AddOrIncrementItem(userId, plantId, quantity ?? 1);

            return res.status(200).json({
                success: true,
                message: "Item added to cart",
                data: item
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to add item to cart",
            });
        }
    }

    async updateCartItem(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "User not authenticated"
                });
            }

            const { plantId } = req.params;

            const { error, value } = updateCartItemSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ success: false, message: error.details[0].message });
            }

            const item = await cartRepository.UpdateCartItem(userId, plantId, value.quantity);
            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: "Item not found in cart"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Cart item updated",
                data: item
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to update cart item",
            });
        }
    }

    async removeFromCart(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "User not authenticated"
                });
            }

            const { plantId } = req.params;
            const item = await cartRepository.removeItem(userId, plantId);

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: "Item not found in cart"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Item removed from cart"
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to remove item from cart",
            });
        }
    }
}

export const cartController = new CartController()