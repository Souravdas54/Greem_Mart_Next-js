import mongoose, { SortOrder, Types } from "mongoose";
import { PlantModel } from "../models/plant.model";
import { PlantInterface } from "../interface/plants.interface";
import { CreatePlantDTO, UpdatePlantDTO, PlantFilterDTO } from "../interface/plants.interface";
import { roleModel } from "../models/Role.Model";

export class PlantRepository {
    // ─── Create ───────────────────────────────────────────────────────────────

    async create(data: CreatePlantDTO, createdBy: Types.ObjectId): Promise<PlantInterface> {
        try {

            // Calculate stock status
            const inStock = data.stockQuantity > 0;

            const plant = new PlantModel({
                ...data,
                rating: 0,
                reviews: 0,
                isFeatured: false,
                isNewArrival: false,
                isPublished: data.isPublished ?? true,
                inStock,
                createdBy,
                updatedBy: createdBy,
            });

            const savedPlant = await plant.save();
            return savedPlant.toObject() as PlantInterface;

        } catch (error) {
            console.error("Error in create plant repository:", error);
            throw new Error(`Failed to create plant: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

    }
    // ─── Find All with Filters ────────────────────────────────────────────────

    async findAll(filters: PlantFilterDTO): Promise<{ plants: PlantInterface[]; total: number; page: number; totalPages: number; }> {
        const {
            category,
            minPrice,
            maxPrice,
            nursery,
            inStock,
            search,
            sortBy = "createdAt",
            sortOrder = "DESC",
            page = 1,
            limit = 10,
        } = filters;

        // const query: <PlantInterface> = {} as any;
        const query: Record<string, unknown> = {};

        if (category) query.category = category;
        if (nursery) query.nursery = { $regex: nursery, $options: "i" };
        if (typeof inStock === "boolean") query.inStock = inStock;

        if (minPrice !== undefined || maxPrice !== undefined) {
            const queryPrice: Record<string, number> = {};
            if (minPrice !== undefined) queryPrice.$gte = minPrice;
            if (maxPrice !== undefined) queryPrice.$lte = maxPrice;
        }

        if (search) {
            query.$text = { $search: search };
        }

        const sortDirection: SortOrder = sortOrder === "ASC" ? 1 : -1;
        const sort: Record<string, SortOrder> = { [sortBy]: sortDirection };

        const skip = (page - 1) * limit;

        const [plants, total] = await Promise.all([
            PlantModel.find(query).sort(sort).skip(skip).limit(limit).lean(),
            PlantModel.countDocuments(query),
        ]);

        return {
            plants: plants as unknown as PlantInterface[],
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    // ─── Find By ID ───────────────────────────────────────────────────────────

    async findById(id: string): Promise<PlantInterface | null> {
        return PlantModel.findById(id).lean() as Promise<PlantInterface | null>;
    }

    // ─── Find by Nursery ──────────────────────────────────────────────────────

    async findByNurseryId(nurseryId: number, filters: PlantFilterDTO): Promise<{
        plants: PlantInterface[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "DESC", inStock } = filters;

        // Override: force nurseryId filter
        const query: Record<string, unknown> = { nurseryId };

        if (inStock !== undefined) {
            query.inStock = inStock;
        }
        const sortDirection: SortOrder = sortOrder === "ASC" ? 1 : -1;

        const skip = (page - 1) * limit;

        const [plants, total] = await Promise.all([
            PlantModel.find(query)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(limit)
                .lean(),
            PlantModel.countDocuments(query),
        ]);

        return {
            plants: plants as unknown as PlantInterface[],
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    // ─── Update ───────────────────────────────────────────────────────────────

    async update(id: string, data: Partial<UpdatePlantDTO>, updatedBy: Types.ObjectId):
        Promise<{ updatedPlant: PlantInterface | null, updatedFields: string[] }> {
            
        // const { id: _id, ...rest } = data as any;
        // return PlantModel.findByIdAndUpdate(id,
        //     { ...rest, updatedBy },
        //     { new: true, runValidators: true }
        // ).lean() as Promise<PlantInterface | null>;

        try {
            // Get the original plant first
            const originalPlant = await PlantModel.findById(id).lean();
            if (!originalPlant) {
                return { updatedPlant: null, updatedFields: [] };
            }

            // Track which fields are being updated
            const updatedFields: string[] = [];
            const updateData: any = { updatedBy };

            // Compare and track changes
            for (const [key, value] of Object.entries(data)) {
                if (key !== '_id' && value !== undefined) {
                    // Check if the value actually changed
                    if (JSON.stringify(originalPlant[key as keyof typeof originalPlant]) !== JSON.stringify(value)) {
                        updatedFields.push(key);
                        updateData[key] = value;
                    }
                }
            }

            // If no fields changed, return early
            if (updatedFields.length === 0) {
                return { updatedPlant: originalPlant as PlantInterface, updatedFields: [] };
            }

            // Perform the update
            const updatedPlant = await PlantModel.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ).lean();

            return {
                updatedPlant: updatedPlant as PlantInterface | null,
                updatedFields
            };
        } catch (error) {
            console.error("Error in update plant repository:", error);
            throw new Error(`Failed to update plant: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // ─── Delete ───────────────────────────────────────────────────────────────

    async delete(id: string): Promise<PlantInterface | null> {
        return PlantModel.findByIdAndDelete(id).lean() as Promise<PlantInterface | null>;
    }

    // ─── Featured Plants ──────────────────────────────────────────────────────

    async findFeatured(limit = 8): Promise<PlantInterface[]> {
        return PlantModel.find({ isFeatured: true, inStock: true })
            .sort({ rating: -1 })
            .limit(limit)
            .lean() as Promise<PlantInterface[]>;
    }

    // ─── Toggle Featured (super_admin only) ───────────────────────────────────

    async toggleFeatured(id: string, updatedBy: Types.ObjectId): Promise<PlantInterface | null> {

        const plant = await PlantModel.findById(id);
        if (!plant) return null;
        plant.isFeatured = !plant.isFeatured;
        plant.updatedBy = updatedBy;
        return plant.save();
    }

    // ─── Update Stock ─────────────────────────────────────────────────────────

    async updateStock(id: string, inStock: boolean, updatedBy: number): Promise<PlantInterface | null> {
        return PlantModel.findByIdAndUpdate(
            id,
            { inStock, updatedBy },
            { new: true }
        ).lean() as Promise<PlantInterface | null>;
    }
}

export const plantRepository = new PlantRepository();