import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const NurseryValidation = {

    create: Joi.object({
        name: Joi.string().min(2).max(100).required()
            .messages({
                'string.empty': 'Nursery name is required',
                'string.min': 'Nursery name must be at least 2 characters long',
                'string.max': 'Nursery name cannot exceed 100 characters',
                'any.required': 'Nursery name is required'
            }),

        ownerUserId: Joi.string().optional() // NOT .required()
            .messages({
                'string.base': 'Owner user ID must be a string'
            }),

        address: Joi.string().min(5).max(500).required()
            .messages({
                'string.empty': 'Address is required',
                'string.min': 'Address must be at least 5 characters long',
                'string.max': 'Address cannot exceed 500 characters',
                'any.required': 'Address is required'
            }),

        location: Joi.object({
            lat: Joi.number().min(-90).max(90).required()
                .messages({
                    'number.base': 'Latitude must be a number',
                    'number.min': 'Latitude must be between -90 and 90',
                    'number.max': 'Latitude must be between -90 and 90',
                    'any.required': 'Latitude is required'
                }),

            lng: Joi.number().min(-180).max(180).required()
                .messages({
                    'number.base': 'Longitude must be a number',
                    'number.min': 'Longitude must be between -180 and 180',
                    'number.max': 'Longitude must be between -180 and 180',
                    'any.required': 'Longitude is required'
                }),

            zone: Joi.string().optional()
                .messages({
                    'string.base': 'Zone must be a string'
                })
        }).required()
            .messages({
                'object.base': 'Location must be an object',
                'any.required': 'Location is required'
            }),

        contact: Joi.string().min(5).max(100).required()
            .messages({
                'string.empty': 'Contact information is required',
                'string.min': 'Contact must be at least 5 characters long',
                'string.max': 'Contact cannot exceed 100 characters',
                'any.required': 'Contact information is required'
            }),

        currency: Joi.string().length(3).uppercase().default('USD')
            .messages({
                'string.length': 'Currency code must be exactly 3 characters',
                'string.base': 'Currency must be a string'
            }),

        isActive: Joi.boolean().default(true)
            .messages({
                'boolean.base': 'isActive must be true or false'
            }),

        metadata: Joi.object({
            climateZones: Joi.array().items(Joi.string()).default([])
                .messages({
                    'array.base': 'Climate zones must be an array',
                    'string.base': 'Each climate zone must be a string'
                }),

            tags: Joi.array().items(Joi.string()).default([])
                .messages({
                    'array.base': 'Tags must be an array',
                    'string.base': 'Each tag must be a string'
                }),

            description: Joi.string().allow('').default('')
                .messages({
                    'string.base': 'Description must be a string'
                }),

            specialties: Joi.array().items(Joi.string()).default([])
                .messages({
                    'array.base': 'Specialties must be an array',
                    'string.base': 'Each specialty must be a string'
                })
        }).default({})
            .messages({
                'object.base': 'Metadata must be an object'
            })
    })

}

// Validation for update (all fields optional)
const updateNurserySchema = Joi.object({
    name: Joi.string().min(2).max(100).optional()
        .messages({
            'string.min': 'Nursery name must be at least 2 characters long',
            'string.max': 'Nursery name cannot exceed 100 characters'
        }),

    address: Joi.string().min(5).max(500).optional()
        .messages({
            'string.min': 'Address must be at least 5 characters long',
            'string.max': 'Address cannot exceed 500 characters'
        }),

    location: Joi.object({
        lat: Joi.number().min(-90).max(90).optional()
            .messages({
                'number.min': 'Latitude must be between -90 and 90',
                'number.max': 'Latitude must be between -90 and 90'
            }),

        lng: Joi.number().min(-180).max(180).optional()
            .messages({
                'number.min': 'Longitude must be between -180 and 180',
                'number.max': 'Longitude must be between -180 and 180'
            }),

        zone: Joi.string().optional()
            .messages({
                'string.base': 'Zone must be a string'
            })
    }).optional()
        .messages({
            'object.base': 'Location must be an object'
        }),

    contact: Joi.string().min(5).max(100).optional()
        .messages({
            'string.min': 'Contact must be at least 5 characters long',
            'string.max': 'Contact cannot exceed 100 characters'
        }),

    currency: Joi.string().length(3).uppercase().optional()
        .messages({
            'string.length': 'Currency code must be exactly 3 characters'
        }),

    isActive: Joi.boolean().optional()
        .messages({
            'boolean.base': 'isActive must be true or false'
        }),

    metadata: Joi.object({
        climateZones: Joi.array().items(Joi.string()).optional()
            .messages({
                'array.base': 'Climate zones must be an array',
                'string.base': 'Each climate zone must be a string'
            }),

        tags: Joi.array().items(Joi.string()).optional()
            .messages({
                'array.base': 'Tags must be an array',
                'string.base': 'Each tag must be a string'
            }),

        description: Joi.string().allow('').optional()
            .messages({
                'string.base': 'Description must be a string'
            }),

        specialties: Joi.array().items(Joi.string()).optional()
            .messages({
                'array.base': 'Specialties must be an array',
                'string.base': 'Each specialty must be a string'
            })
    }).optional().messages({
        'object.base': 'Metadata must be an object'
    })
});


// Validation for search query
export const validateSearchQuery = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        q: Joi.string().min(1).required()
            .messages({
                'string.empty': 'Search query is required',
                'string.min': 'Search query must be at least 1 character long',
                'any.required': 'Search query is required'
            }),
        page: Joi.number().min(1).default(1)
            .messages({
                'number.base': 'Page must be a number',
                'number.min': 'Page must be at least 1'
            }),
        limit: Joi.number().min(1).max(100).default(10)
            .messages({
                'number.base': 'Limit must be a number',
                'number.min': 'Limit must be at least 1',
                'number.max': 'Limit cannot exceed 100'
            })
    });

    const { error } = schema.validate(req.query, { abortEarly: false });

    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));

        return res.status(400).json({
            success: false,
            errors,
            message: 'Search validation failed'
        });
    }

    next();
};

// Validation for location query
export const validateLocationQuery = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        lat: Joi.number().min(-90).max(90).required()
            .messages({
                'number.base': 'Latitude must be a number',
                'number.min': 'Latitude must be between -90 and 90',
                'number.max': 'Latitude must be between -90 and 90',
                'any.required': 'Latitude is required'
            }),
        lng: Joi.number().min(-180).max(180).required()
            .messages({
                'number.base': 'Longitude must be a number',
                'number.min': 'Longitude must be between -180 and 180',
                'number.max': 'Longitude must be between -180 and 180',
                'any.required': 'Longitude is required'
            }),
        radius: Joi.number().min(0.1).max(100).default(10)
            .messages({
                'number.base': 'Radius must be a number',
                'number.min': 'Radius must be at least 0.1 km',
                'number.max': 'Radius cannot exceed 100 km'
            }),
        page: Joi.number().min(1).default(1)
            .messages({
                'number.base': 'Page must be a number',
                'number.min': 'Page must be at least 1'
            }),
        limit: Joi.number().min(1).max(50).default(10)
            .messages({
                'number.base': 'Limit must be a number',
                'number.min': 'Limit must be at least 1',
                'number.max': 'Limit cannot exceed 50'
            })
    });

    const { error } = schema.validate(req.query, { abortEarly: false });

    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));

        return res.status(400).json({
            success: false,
            errors,
            message: 'Location validation failed'
        });
    }

    next();
};