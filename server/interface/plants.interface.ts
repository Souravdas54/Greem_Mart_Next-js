export interface PlantInterface {
    id: number;
    name: string;
    scientificName: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    image: string;
    category: 'indoor' | 'outdoor' | 'succulent' | 'flowering';
    nursery: string;
    nurseryId: number; // Reference to nursery admin
    inStock: boolean;
    isNewArrival: boolean;
    isFeatured: boolean;
    description: string;
    careInstructions: {
        light: string;
        water: string;
        temperature: string;
    };
    discount?: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: number; // User ID who created
    updatedBy: number; // User ID who last updated
}

export interface CreatePlantDTO {
    name: string;
    scientificName: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: 'indoor' | 'outdoor' | 'succulent' | 'flowering';
    nursery: string;
    nurseryId: number;
    inStock: boolean;
    description: string;
    careInstructions: {
        light: string;
        water: string;
        temperature: string;
    };
    discount?: number;
}

export interface UpdatePlantDTO extends Partial<CreatePlantDTO> {
    id: number;
    rating?: number;
    reviews?: number;
    isNewArrival?: boolean;
    isFeatured?: boolean;
}

export interface PlantFilterDTO {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    nursery?: string;
    inStock?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}

export interface PlantResponseDTO {
    id: number;
    name: string;
    scientificName: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    image: string;
    category: string;
    nursery: string;
    inStock: boolean;
    isNewArrival: boolean;
    isFeatured: boolean;
    description: string;
    careInstructions: {
        light: string;
        water: string;
        temperature: string;
    };
    discount?: number;
    createdAt: Date;
}