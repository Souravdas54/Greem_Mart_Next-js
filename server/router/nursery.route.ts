import express from 'express';
import { authorizeRoles, protect } from '../middleware/Middleware';
import { nurseryController } from '../controllers/Nursery.Controller';

const nurseryRouter = express.Router()

nurseryRouter.post('/create', protect, authorizeRoles('super_admin', 'nursery_admin'), nurseryController.createNursery);

nurseryRouter.get('/by-id/:id', protect, authorizeRoles('super_admin', 'nursery_admin', 'user'), nurseryController.getNurseryById)

nurseryRouter.get('/owner/:ownerId', protect, authorizeRoles('super_admin', 'nursery_admin', 'user'), nurseryController.getNurseryByOwner)

nurseryRouter.put('/update/:id', protect, authorizeRoles('super_admin', 'nursery_admin'), nurseryController.update_nursery_byId)

nurseryRouter.get('/search', protect, authorizeRoles('super_admin', 'nursery_admin'), nurseryController.searchNurseries);

export { nurseryRouter }