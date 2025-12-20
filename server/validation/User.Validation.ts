import Joi from 'joi';

export const UserValidation = {

    // Signup validation
    signup: Joi.object({
        name: Joi.string().min(3).max(50).required().messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 3 characters long',
            'string.max': 'Name cannot exceed 50 characters',
            'any.required': 'Name is required'
        }),
        email: Joi.string().email().required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
        password: Joi.string()
            .min(8)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .required()
            .messages({
                'string.empty': 'Password is required',
                'string.min': 'Password must be at least 8 characters long',
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                'any.required': 'Password is required'
            }),
        confirmPassword: Joi.any().equal(Joi.ref('password'))
            .required()
            .messages({
                'any.only': 'Confirm password must match password',
                'any.required': 'Please confirm your password'
            }),
        avatarUrl: Joi.string().uri().optional().messages({
            'string.uri': 'Profile picture must be a valid URL'
        }),
        role: Joi.string().valid('super_admin', 'nursery_admin', 'user').default('user').messages({
            'any.only': 'Role must be either "super_admin", "nursery_admin", or "user"'
        }),
        nurseryId: Joi.when('role', {
            is: 'nursery_admin',
            then: Joi.string().required().messages({
                'string.empty': 'Nursery ID is required for nursery_admin',
                'any.required': 'Nursery ID is required for nursery_admin'
            }),
            otherwise: Joi.forbidden().messages({
                'any.unknown': 'nurseryId is not allowed for this role'
            })
        }),
        location: Joi.object({
            lat: Joi.number().min(-90).max(90).required().messages({
                'number.base': 'Latitude must be a number',
                'number.min': 'Latitude must be between -90 and 90',
                'number.max': 'Latitude must be between -90 and 90',
                'any.required': 'Latitude is required'
            }),
            lng: Joi.number().min(-180).max(180).required().messages({
                'number.base': 'Longitude must be a number',
                'number.min': 'Longitude must be between -180 and 180',
                'number.max': 'Longitude must be between -180 and 180',
                'any.required': 'Longitude is required'
            }),
            zone: Joi.string().optional().messages({
                'string.base': 'Zone must be a string'
            })
        }).optional(),
        isVerified: Joi.boolean().optional().default(false).messages({
            'boolean.base': 'isVerified must be a boolean'
        })
    }),

    // Login validation
    login: Joi.object({
        email: Joi.string().email().required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
        password: Joi.string().required().messages({
            'string.empty': 'Password is required',
            'any.required': 'Password is required'
        })
    }),

    // Update profile validation
    updateProfile: Joi.object({
        name: Joi.string().min(3).max(50).optional().messages({
            'string.min': 'Name must be at least 3 characters long',
            'string.max': 'Name cannot exceed 50 characters'
        }),
        avatarUrl: Joi.string().uri().optional().messages({ // Fixed typo: avaterUrl -> avatarUrl
            'string.uri': 'Profile picture must be a valid URL'
        }),
        location: Joi.alternatives().try(
            Joi.string().optional().messages({
                'string.base': 'Location must be a string or an object'
            }),
            Joi.object({
                lat: Joi.number().min(-90).max(90).optional().messages({
                    'number.base': 'Latitude must be a number',
                    'number.min': 'Latitude must be between -90 and 90',
                    'number.max': 'Latitude must be between -90 and 90'
                }),
                lng: Joi.number().min(-180).max(180).optional().messages({
                    'number.base': 'Longitude must be a number',
                    'number.min': 'Longitude must be between -180 and 180',
                    'number.max': 'Longitude must be between -180 and 180'
                }),
                zone: Joi.string().optional().messages({
                    'string.base': 'Zone must be a string'
                })
            }).optional()
        ).optional().messages({
            'alternatives.types': 'Location must be either a string or an object with lat/lng/zone properties',
            'alternatives.match': 'Location must be either a string or an object with lat/lng/zone properties'
        }),

    }),

    // Change password validation
    changePassword: Joi.object({
        currentPassword: Joi.string().required().messages({
            'string.empty': 'Current password is required',
            'any.required': 'Current password is required'
        }),
        newPassword: Joi.string()
            .min(8)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .required()
            .messages({
                'string.empty': 'New password is required',
                'string.min': 'New password must be at least 8 characters long',
                'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                'any.required': 'New password is required'
            }),
        confirmPassword: Joi.any().equal(Joi.ref('newPassword'))
            .required()
            .messages({
                'any.only': 'Confirm password must match new password',
                'any.required': 'Please confirm your password'
            })
    }),

    // Email validation for forgot password/resend verification
    emailValidation: Joi.object({
        email: Joi.string().email().required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        })
    }),

    // OTP validation
    verifyOtp: Joi.object({
        email: Joi.string().email().required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
        otp: Joi.string().length(6).pattern(/^\d+$/).required().messages({
            'string.empty': 'OTP is required',
            'string.length': 'OTP must be 6 digits',
            'string.pattern.base': 'OTP must contain only numbers',
            'any.required': 'OTP is required'
        })
    }),

    // Reset password validation
    resetPassword: Joi.object({
        token: Joi.string().required().messages({
            'string.empty': 'Token is required',
            'any.required': 'Token is required'
        }),
        newPassword: Joi.string()
            .min(8)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .required()
            .messages({
                'string.empty': 'New password is required',
                'string.min': 'New password must be at least 8 characters long',
                'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                'any.required': 'New password is required'
            }),
        confirmPassword: Joi.any().equal(Joi.ref('newPassword'))
            .required()
            .messages({
                'any.only': 'Confirm password must match new password',
                'any.required': 'Please confirm your password'
            })
    })
};