import { Request, Response } from "express";
import { NurseryValidation } from "../validation/Nursery.Validation";
import { nurseryRepositories } from "../repositories/Nursery.Repository";
import { NurseryInterface, UpdateNurseryInterface } from "../interface/Nursery.Interface";
import { userRepositories } from "../repositories/User.Repositories";
import { roleModel } from "../models/Role.Model";
import { string } from "joi";
import mongoose from "mongoose";

class NurseryController {

    async createNursery(req: Request, res: Response): Promise<Response> {
        try {
            // Add debug logging
            console.log("=== DEBUG ===");
            console.log("Request Body:", req.body);

            // Get user ID from authenticated request
            const userId = (req.user as any)?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "User not authenticated"
                });
            }
            console.log("User ID:", userId);
            console.log("Validation Data:", { ...req.body, ownerUserId: userId });

            // Get user details
            const user = await userRepositories.getUserById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Get user's role
            const roleDoc = await roleModel.findById(user.role);
            if (!roleDoc) {
                return res.status(403).json({
                    success: false,
                    message: "User role not found"
                });
            }

            // Check role
            const roleName = roleDoc.name;
            const allowedRoles = ['super_admin', 'nursery_admin'];

            if (!allowedRoles.includes(roleName)) {
                return res.status(403).json({
                    success: false,
                    message: "Only super_admin or nursery_admin can create nurseries"
                });
            }

            // IMPORTANT: Prepare validation data with ownerUserId
            const requestData = req.body;

            // Create validation data with ownerUserId
            const validationData = {
                ...requestData,
                ownerUserId: userId // Add current user ID for validation
            };

            // Validate input
            const { error, value } = NurseryValidation.create.validate(validationData);
            if (error) {
                console.log("Validation error:", error.details);
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    details: error.details
                });
            }

            // Prepare nursery data
            const nurseryData: any = {
                name: value.name,
                address: value.address,
                location: value.location,
                contact: value.contact,
                currency: value.currency?.toUpperCase() || 'INR',
                isActive: value.isActive !== undefined ? value.isActive : true
            };

            // Handle metadata
            if (value.metadata) {
                nurseryData.metadata = value.metadata;
            }

            // Set owner based on role
            if (roleName === 'super_admin') {
                // Super admin can specify owner or use their own ID
                nurseryData.ownerUserId = value.ownerUserId || userId;
            } else {
                // Nursery admin can only create for themselves
                nurseryData.ownerUserId = userId;
            }

            // Create nursery
            const newNursery = await nurseryRepositories.create(nurseryData);

            return res.status(201).json({
                success: true,
                message: "Nursery created successfully",
                data: newNursery
            });

        } catch (error: any) {
            console.error("Create nursery error:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Find nursery by ID
    async getNurseryById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;

            const nursery = await nurseryRepositories.findById(id);
            if (!nursery) {
                res.status(404).json({
                    success: false,
                    message: "Not found nursery"
                })
            }
            return res.status(200).json({
                success: true,
                message: "Nursery found success fully",
                data: nursery
            })
        } catch (error: any) {
            console.error("Get nursery by ID error:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Find nurseries by owner
    async getNurseryByOwner(req: Request, res: Response): Promise<Response> {
        try {
            const { ownerId } = req.params;

            // Validate ownerId
            if (!mongoose.Types.ObjectId.isValid(ownerId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid owner ID format"
                });
            }

            const nurseries = await nurseryRepositories.findByOwner(ownerId)

            if (nurseries.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No nurseries found for this owner"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Nurseries retrieved successfully",
                data: nurseries,
                total: nurseries.length
            })
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);

            console.error("Get Nursery by owner error", errorMessage);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            })
        }
    }

    // Update nursery by ID
    async update_nursery_byId(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;

            const { error, value } = NurseryValidation.updateNurserySchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            const updateData: UpdateNurseryInterface = value;

            if (updateData.currency) {
                updateData.currency = updateData.currency.toUpperCase();

            }

            const updateNurseryById = await nurseryRepositories.update_nursery(id, updateData)
            if (!updateNurseryById) {
                return res.status(404).json({
                    success: false,
                    message: "Nursery not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Nursery updated successfully",
                data: updateNurseryById
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);

            console.error("Update nursery error", errorMessage);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            })
        }
    }

    // Search nurseries by query
    async searchNurseries(req: Request, res: Response): Promise<Response> {
        try {
            const searchTerm = req.query.q || req.query.query;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            if (!searchTerm || typeof searchTerm !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: "Search query is required"
                });
            }

            const { nurseries, total } = await nurseryRepositories.search(searchTerm, page, limit);

            return res.status(200).json({
                success: true,
                message: "Search results retrieved successfully",
                data: nurseries,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            });

        } catch (error: any) {
            console.error("Search nurseries error:", error.message);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }
}

export const nurseryController = new NurseryController();