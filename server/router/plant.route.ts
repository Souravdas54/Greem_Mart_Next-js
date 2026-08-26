import { Router } from "express";
import { plantController } from "../controllers/Plant.Controller";
import { protect, authorizeRoles } from "../middleware/Middleware";

const plantRouter = Router();

// ─── Public Routes ────────────────────────────────────────────────────────────

// GET /api/plants → All plants with filters & pagination
plantRouter.get("/user-plant", plantController.getAllPlants.bind(plantController));

// GET /api/plants/feat→ Featured plants
plantRouter.get("/user-featured", plantController.getFeaturedPlants.bind(plantController));

// GET /api/plants/nursery/:→ Plants by nursery
plantRouter.get("/user-nursery/:nurseryId", plantController.getPlantsByNursery.bind(plantController));

// GET /api/plants/:id → Single plant
plantRouter.get("/user-plant/:id", plantController.getPlantById.bind(plantController));

// ─── Protected Routes ──────────────────────────────────────────────────────────

// POST /api/plants → Create plant (super_admin, nursery_admin)
plantRouter.post("/admin-plant", protect, authorizeRoles("super_admin", "nursery_admin"), plantController.createPlant.bind(plantController));

// PUT /api/plants/:id → Update plant (super_admin, nursery_admin)
plantRouter.put("/admin-plant/:id", protect, authorizeRoles("super_admin", "nursery_admin"), plantController.updatePlant.bind(plantController));

// PATCH /api/plants/:i→ Update stock (super_admin, nursery_admin)
plantRouter.patch("/admin-plant/:id/stock", protect, authorizeRoles("super_admin", "nursery_admin"), plantController.updateStock.bind(plantController));

// PATCH /api/plants/:id→ Toggle featured (super_admin only)
plantRouter.patch("/admin-plant/:id/featured", protect, authorizeRoles("super_admin", "nursery_admin"), plantController.toggleFeatured.bind(plantController));

// DELETE /api/plants/:→ Delete plant (super_admin only)
plantRouter.delete("/admin-plant/:id", protect, authorizeRoles("super_admin", "nursery_admin"), plantController.deletePlant.bind(plantController));

export { plantRouter };