import joi from 'joi';

export const addToCartSchema = joi.object({
    plantId: joi.string().required().messages({
        'string.empty': 'plantId is required',
        'any.required': 'plantId is required'
    }),
    quantity: joi.number().positive().optional().default(1),
    userId: joi.string().optional()
});

export const updateCartItemSchema = joi.object({
    quantity: joi.number().positive().required(),
});

// validation/Whishlist.Validation.ts

export const addToWishlistSchema = joi.object({
    plantId: joi.string().required(),
    quantity: joi.number().integer().min(1).optional()
});