import mongoose, { Types } from "mongoose";
import { NurseryInterface, CreateNurseryInterface, UpdateNurseryInterface, NurseryMetadataInterface } from "../interface/Nursery.Interface";
import { nurseryModel } from "../models/Nursery.Model";
import { object } from "joi";

// Create your own FilterQuery type
type FilterQuery<T> = {
    [P in keyof T]?: any;
} & {
    $or?: any[];
    $and?: any[];
    [key: string]: any;
};

class NurseryRepositories {

    async create(nurseryData: CreateNurseryInterface): Promise<NurseryInterface> {
        try {
            const ownerUserId = typeof nurseryData.ownerUserId === 'string'
                ? new Types.ObjectId(nurseryData.ownerUserId) : nurseryData.ownerUserId;

            const nurseryToCreate = {
                ...nurseryData, ownerUserId,
                metadata: {
                    climateZones: nurseryData.metadata?.climateZones || [],
                    tags: nurseryData.metadata?.tags || [],
                    description: nurseryData.metadata?.description,
                    specialties: nurseryData.metadata?.specialties || []
                }
            }
            const newNursery = await nurseryModel.create(nurseryToCreate);

            return newNursery as unknown as NurseryInterface;

        } catch (error: any) {
            console.error("Repository Error - create:", error.message);
            throw error;
        }
    }

    // Find nursery by ID
    async findById(id: string | Types.ObjectId): Promise<NurseryInterface | null> {
        try {
            const nursery = await nurseryModel.findById(id)
            return nursery as unknown as NurseryInterface;
        } catch (error) {
            console.log("Repository error - findById", error);
            throw error;

        }
    }

    // Find nurseries by owner
    async findByOwner(ownerId: string | Types.ObjectId): Promise<NurseryInterface[]> {
        try {
            // Convert string to ObjectId
            if (!mongoose.Types.ObjectId.isValid(ownerId)) {
                return [];
            }

            const objectId = new mongoose.Types.ObjectId(ownerId);

            const nurseries = await nurseryModel.find({ ownerUserId: objectId })
            return nurseries as unknown as NurseryInterface[];
        } catch (error) {
            console.log("Repository error - findByOwner", error);
            throw error;
        }
    }

    // Update Nursery by Id
    async update_nursery(id: string | Types.ObjectId, updateData: UpdateNurseryInterface): Promise<NurseryInterface | null> {
        try {
            const updateNursery = await nurseryModel.findByIdAndUpdate(id, updateData, { new: true });

            return updateNursery as unknown as NurseryInterface;
        } catch (error) {
            console.log("Repository error - Update Nursery", error);
            throw error;
        }
    }

    // Search nurseries by query

    async search(query: string, page: number = 1, limit: number = 10): Promise<{ nurseries: NurseryInterface[]; total: number }> {
        try {
            const skip = (page - 1) * limit;

            const searchQuery: FilterQuery<NurseryInterface> = {
                isActive: true,
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { address: { $regex: query, $options: 'i' } },
                    { 'metadata.tags': { $regex: query, $options: 'i' } },
                    { 'metadata.description': { $regex: query, $options: 'i' } }
                ]
            };

            const [nurseries, total] = await Promise.all([
                nurseryModel.find(searchQuery)
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 })
                    .lean(),
                nurseryModel.countDocuments(searchQuery)
            ]);

            return {
                nurseries: nurseries as unknown as NurseryInterface[],
                total
            };
        } catch (error) {
            console.error("Repository Error - search:", error);
            throw error;
        }
    }


}

const nurseryRepositories = new NurseryRepositories()
export { nurseryRepositories }