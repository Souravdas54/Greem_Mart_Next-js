import { Request, Response } from "express";
import { plantRepository } from "../repositories/Plant.Repository";
import { CreatePlantDTO, PlantFilterDTO, UpdatePlantDTO } from "../interface/plants.interface";

export class PlantController {
    // ─── POST /plants ─────────────────────────────────────────────────────────
    // Access: super_admin, nursery_admin
    async createPlant(req: Request, res: Response): Promise<Response> {
        try {
            const data: CreatePlantDTO = req.body;
            const userId = Number(req.user?.userId);

            // nursery_admin can only create for their own nursery
            if (req.user?.role === "nursery_admin") {
                const adminNurseryId = Number(req.user?.userId);
                if (data.nurseryId !== adminNurseryId) {
                    return res.status(403).json({
                        success: false,
                        message: "You can only create plants for your own nursery",
                    });
                }
            }

            const plant = await plantRepository.create(data, userId);

            return res.status(201).json({
                success: true,
                message: "Plant created successfully",
                data: plant,
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to create plant",
            });
        }
    }

    // ─── GET /plants ──────────────────────────────────────────────────────────
    // Access: public
    async getAllPlants(req: Request, res: Response): Promise<Response> {
        try {
            const filters: PlantFilterDTO = {
                category: req.query.category as string,
                minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
                maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
                nursery: req.query.nursery as string,
                inStock: req.query.inStock !== undefined
                    ? req.query.inStock === "true"
                    : undefined,
                search: req.query.search as string,
                sortBy: (req.query.sortBy as string) || "createdAt",
                sortOrder: (req.query.sortOrder as "ASC" | "DESC") || "DESC",
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
            };

            const result = await plantRepository.findAll(filters);

            return res.status(200).json({
                success: true,
                data: result.plants,
                meta: {
                    total: result.total,
                    page: result.page,
                    totalPages: result.totalPages,
                },
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch plants",
            });
        }
    }

    // ─── GET /plants/featured ─────────────────────────────────────────────────
    // Access: public
    async getFeaturedPlants(req: Request, res: Response): Promise<Response> {
        try {
            const limit = req.query.limit ? Number(req.query.limit) : 8;
            const plants = await plantRepository.findFeatured(limit);

            return res.status(200).json({
                success: true,
                data: plants,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch featured plants",
            });
        }
    }

    // ─── GET /plants/:id ──────────────────────────────────────────────────────
    // Access: public
    async getPlantById(req: Request, res: Response): Promise<Response> {
        try {
            const plant = await plantRepository.findById(req.params.id);

            if (!plant) {
                return res.status(404).json({
                    success: false,
                    message: "Plant not found",
                });
            }

            return res.status(200).json({
                success: true,
                data: plant,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch plant",
            });
        }
    }

    // ─── GET /plants/nursery/:nurseryId ───────────────────────────────────────
    // Access: public
    async getPlantsByNursery(req: Request, res: Response): Promise<Response> {
        try {
            const nurseryId = Number(req.params.nurseryId);
            const filters: PlantFilterDTO = {
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
                sortBy: (req.query.sortBy as string) || "createdAt",
                sortOrder: (req.query.sortOrder as "ASC" | "DESC") || "DESC",
                inStock: req.query.inStock !== undefined
                    ? req.query.inStock === "true"
                    : undefined,
            };

            const result = await plantRepository.findByNurseryId(nurseryId, filters);

            return res.status(200).json({
                success: true,
                data: result.plants,
                meta: {
                    total: result.total,
                    page: result.page,
                    totalPages: result.totalPages,
                },
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch nursery plants",
            });
        }
    }

    // ─── PUT /plants/:id ──────────────────────────────────────────────────────
    // Access: super_admin (any), nursery_admin (own nursery only)
    async updatePlant(req: Request, res: Response): Promise<Response> {
        try {
            const id = req.params.id;
            const userId = Number(req.user?.userId);
            const data: Partial<UpdatePlantDTO> = req.body;

            // nursery_admin can only update plants of their own nursery
            if (req.user?.role === "nursery_admin") {
                const existing = await plantRepository.findById(id);
                if (!existing) {
                    return res.status(404).json({
                        success: false,
                        message: "Plant not found",
                    });
                }
                if (existing.nurseryId !== userId) {
                    return res.status(403).json({
                        success: false,
                        message: "You can only update plants from your own nursery",
                    });
                }
                // nursery_admin cannot change isFeatured or rating/reviews
                delete (data as any).isFeatured;
                delete (data as any).rating;
                delete (data as any).reviews;
            }

            const updated = await plantRepository.update(id, data, userId);

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: "Plant not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Plant updated successfully",
                data: updated,
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to update plant",
            });
        }
    }

    // ─── PATCH /plants/:id/featured ───────────────────────────────────────────
    // Access: super_admin only
    async toggleFeatured(req: Request, res: Response): Promise<Response> {
        try {
            const userId = Number(req.user?.userId);
            const plant = await plantRepository.toggleFeatured(req.params.id, userId);

            if (!plant) {
                return res.status(404).json({
                    success: false,
                    message: "Plant not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: `Plant ${plant.isFeatured ? "featured" : "unfeatured"} successfully`,
                data: plant,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to toggle featured status",
            });
        }
    }

    // ─── PATCH /plants/:id/stock ──────────────────────────────────────────────
    // Access: super_admin, nursery_admin (own nursery)
    async updateStock(req: Request, res: Response): Promise<Response> {
        try {
            const id = req.params.id;
            const userId = Number(req.user?.userId);
            const { inStock } = req.body;

            if (typeof inStock !== "boolean") {
                return res.status(400).json({
                    success: false,
                    message: "inStock must be a boolean value",
                });
            }

            if (req.user?.role === "nursery_admin") {
                const existing = await plantRepository.findById(id);
                if (!existing) {
                    return res.status(404).json({ success: false, message: "Plant not found" });
                }
                if (existing.nurseryId !== userId) {
                    return res.status(403).json({
                        success: false,
                        message: "You can only update stock for your own nursery's plants",
                    });
                }
            }

            const plant = await plantRepository.updateStock(id, inStock, userId);

            if (!plant) {
                return res.status(404).json({ success: false, message: "Plant not found" });
            }

            return res.status(200).json({
                success: true,
                message: `Plant marked as ${inStock ? "in stock" : "out of stock"}`,
                data: plant,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to update stock",
            });
        }
    }

    // ─── DELETE /plants/:id ───────────────────────────────────────────────────
    // Access: super_admin only
    async deletePlant(req: Request, res: Response): Promise<Response> {
        try {
            const deleted = await plantRepository.delete(req.params.id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: "Plant not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Plant deleted successfully",
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to delete plant",
            });
        }
    }
}

export const plantController = new PlantController();