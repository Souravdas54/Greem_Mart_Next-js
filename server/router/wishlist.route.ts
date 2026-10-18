import express from "express"
import { protect, authorizeRoles } from "../middleware/Middleware";
import { whishlistController } from "../controllers/Whishlist.Controller";

const WishlistRouter = express.Router();

WishlistRouter.post('/add', protect, authorizeRoles('super_admin', 'nursery_admin', 'user'), whishlistController.addTowishlist);
WishlistRouter.get('/get', protect, authorizeRoles('super_admin', 'nursery_admin', 'user'), whishlistController.getWishlist);
WishlistRouter.delete('/remove/:plantId', protect, authorizeRoles('super_admin', 'nursery_admin', 'user'), whishlistController.removeFromWishlist);

export { WishlistRouter }