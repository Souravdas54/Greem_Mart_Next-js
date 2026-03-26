import mongoose, { SortOrder, FilterQuery } from "mongoose";
import { PlantModel } from "../models/plant.model";
import { PlantInterface } from "../interface/plants.interface";
import { CreatePlantDTO, UpdatePlantDTO, PlantFilterDTO } from "../interface/plants.interface";

// type FilterQuery<T> = mongoose.FilterQuery<T>;

export class PlantRepository {
    // ─── Create ───────────────────────────────────────────────────────────────

    async create(data: CreatePlantDTO, createdBy: number): Promise<PlantInterface> {
        const plant = new PlantModel({
            ...data,
            rating: 0,
            reviews: 0,
            isFeatured: false,
            createdBy,
            updatedBy: createdBy,
        });
        return plant.save();
    }

    // ─── Find All with Filters ────────────────────────────────────────────────

    async findAll(filters: PlantFilterDTO): Promise<{
        plants: PlantInterface[];
        total: number; page: number; totalPages: number;
    }> {
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

        const query: FilterQuery<PlantInterface> = {};

        if (category) query.category = category;
        if (nursery) query.nursery = { $regex: nursery, $options: "i" };
        if (typeof inStock === "boolean") query.inStock = inStock;

        if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};
            if (minPrice !== undefined) query.price.$gte = minPrice;
            if (maxPrice !== undefined) query.price.$lte = maxPrice;
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
        const query: FilterQuery<PlantInterface> = { nurseryId };

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

    async update(
        id: string,
        data: Partial<UpdatePlantDTO>,
        updatedBy: number
    ): Promise<PlantInterface | null> {
        const { id: _id, ...rest } = data as any;
        return PlantModel.findByIdAndUpdate(
            id,
            { ...rest, updatedBy },
            { new: true, runValidators: true }
        ).lean() as Promise<PlantInterface | null>;
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

    async toggleFeatured(
        id: string,
        updatedBy: number
    ): Promise<PlantInterface | null> {
        const plant = await PlantModel.findById(id);
        if (!plant) return null;
        plant.isFeatured = !plant.isFeatured;
        plant.updatedBy = updatedBy;
        return plant.save();
    }

    // ─── Update Stock ─────────────────────────────────────────────────────────

    async updateStock(
        id: string,
        inStock: boolean,
        updatedBy: number
    ): Promise<PlantInterface | null> {
        return PlantModel.findByIdAndUpdate(
            id,
            { inStock, updatedBy },
            { new: true }
        ).lean() as Promise<PlantInterface | null>;
    }
}

export const plantRepository = new PlantRepository();