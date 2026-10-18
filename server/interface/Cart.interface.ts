export interface AddToCartDTO {
     plantId: string,  
    quantity: number  
}

export interface UpdateCartDTO {
     quantity: number 
}

export interface AuthenticatedRequest extends Express.Request {
    userId: {
        _id: string,
        email: string,
        [key: string]: any
    }
}