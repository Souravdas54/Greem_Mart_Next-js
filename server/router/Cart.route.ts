import express from 'express';
import { protect, authorizeRoles } from "../middleware/Middleware";
import { cartController } from '../controllers/Cart.Controller';

const CartRouter = express.Router()

CartRouter.get('/get/:id', protect, authorizeRoles('super_admin', 'nursery_admin', 'user'), cartController.getCartById)

CartRouter.get('/my-cart', protect, authorizeRoles('super_admin', 'nursery_admin', 'user'), cartController.getCart);

CartRouter.post('/addcart', protect, authorizeRoles('super_admin', 'nursery_admin', 'user'), cartController.addToCart);

CartRouter.patch('/update/:plantId', protect, authorizeRoles('super_admin', 'nursery_admin', 'user'), cartController.updateCartItem);

CartRouter.delete('/remove/:plantId', protect, authorizeRoles('super_admin', 'nursery_admin', 'user'), cartController.removeFromCart);

export { CartRouter }