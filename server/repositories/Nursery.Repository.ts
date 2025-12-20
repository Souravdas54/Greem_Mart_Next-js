import { Types } from "mongoose";
import { NurseryInterface, CreateNurseryInterface, UpdateNurseryInterface, NurseryMetadataInterface } from "../interface/Nursery.Interface";
import { nurseryModel } from "../models/Nursery.Model";


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
    
}

const nurseryRepositories = new NurseryRepositories()
export { nurseryRepositories }