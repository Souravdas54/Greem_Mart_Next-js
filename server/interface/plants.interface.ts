import { Types } from "mongoose";

export interface CareInstructionsInterface {
    light: string;
    water: string;
    temperature: string;
}

export interface PlantInterface {
    _id: Types.ObjectId;
    name: string;
    scientificName: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    images: string[];
    category: 'indoor' | 'outdoor' | 'succulent' | 'flowering';
    nursery: string;
    nurseryId: Types.ObjectId; // Reference to nursery admin
    inStock: boolean;
    stockQuantity: number; // stock quantity
    isNewArrival: boolean;
    isFeatured: boolean;
    isPublished: boolean;  // publish status
    description: string;
    careInstructions: CareInstructionsInterface;
    discount?: number;

    tags?: string[]; // tags for better search
    sizes?: string[]; // sizes
    colors?: string[]; // colors

    createdBy: Types.ObjectId; // User ID who created (Super Admin or Nursery Admin)
    updatedBy: Types.ObjectId; // User ID who last updated

    createdAt: Date;
    updatedAt: Date;
}

export interface CreatePlantDTO {
    name: string;
    scientificName?: string;
    price: number;
    originalPrice?: number;
    images: string[];
    category: 'indoor' | 'outdoor' | 'succulent' | 'flowering';
    nursery: string;
    nurseryId: Types.ObjectId;
    inStock?: boolean;
    stockQuantity: number;
    description: string;
    careInstructions: CareInstructionsInterface;
    discount?: number;
    tags?: string[];
    sizes?: string[];
    colors?: string[];
    isNewArrival?: boolean;
    isFeatured?: boolean;
    isPublished?: boolean;
}

export interface UpdatePlantDTO extends Partial<CreatePlantDTO> {
    rating?: number;
    reviews?: number;
    isNewArrival?: boolean;
    isFeatured?: boolean;
    isPublished?: boolean;
}

export interface PlantFilterDTO {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    nursery?: string;
    nurseryId?: Types.ObjectId;
    inStock?: boolean;
    isPublished?: boolean;
    isNewArrival?: boolean;
    isFeatured?: boolean;
    search?: string;
    tags?: string[];
    minRating?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}

export interface PlantResponseDTO {
    _id: Types.ObjectId;
    name: string;
    scientificName: string;
    price: number;
    originalPrice?: number;
    discountedPrice?: number;
    rating: number;
    reviews: number;
    images: string[];
    category: string;
    nursery: string;
    nurseryId: Types.ObjectId;
    inStock: boolean;
    stockQuantity: number;
    isNewArrival: boolean;
    isFeatured: boolean;
    isPublished: boolean;
    description: string;
    careInstructions: CareInstructionsInterface;
    discount?: number;
    tags?: string[];
    sizes?: string[];
    colors?: string[];
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}