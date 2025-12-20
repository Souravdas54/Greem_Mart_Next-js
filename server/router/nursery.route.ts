import express from 'express';
import { authorizeRoles, protect } from '../middleware/Middleware';
import { nurseryController } from '../controllers/Nursery.Controller';

const nurseryRouter = express.Router()

nurseryRouter.post('/create', protect, authorizeRoles('super_admin', 'nursery_admin'), nurseryController.createNursery);

export { nurseryRouter }