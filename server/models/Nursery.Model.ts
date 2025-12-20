import { model, Schema, Types } from "mongoose";
import { NurseryInterface, LocationInterface, NurseryMetadataInterface } from "../interface/Nursery.Interface";

const LocationSchema: Schema = new Schema<LocationInterface>({
    lat: {
        type: Number,
        required: true,
    },
    lng: {
        type: Number,
        required: true
    },
    zone: {
        type: String,
    },

}, { _id: false })

// Metadata Schema //
const MetadataSchema: Schema = new Schema<NurseryMetadataInterface>({
    climateZones: {
        type: [String],
        default: [],
        validate: {
            validator: function (zones: string[]) {
                return zones.every(zone => typeof zone === 'string' && zone.trim().length > 0);
            },
            message: 'Climate zones must be non-empty strings'
        }
    },
    tags: {
        type: [String],
        default: [],
        validate: {
            validator: function (tags: string[]) {
                return tags.every(tag => typeof tag === 'string' && tag.trim().length > 0);
            },
            message: 'Tags must be non-empty strings'
        }
    },
    description: {
        type: String,
    },
    specialties: {
        type: [String],
        default: [],
    },
}, { _id: false })

const NurserySchema: Schema = new Schema<NurseryInterface>({
    name: {
        type: String,
        required: [true, 'Nursery name is required'],
        trim: true,
        minlength: [2, 'Nursery name must be at least 2 characters long'],
        maxlength: [100, 'Nursery name cannot exceed 100 characters'],
        index: true
    },
    ownerUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Owner user ID is required'],
        index: true
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        minlength: [5, 'Address must be at least 5 characters long'],
        maxlength: [500, 'Address cannot exceed 500 characters']
    },
    location: {
        type: LocationSchema,
        required: [true, 'Location is required']
    },
    contact: {
        type: String,
        required: [true, 'Contact information is required'],
        trim: true,
        minlength: [5, 'Contact must be at least 5 characters long'],
        maxlength: [100, 'Contact cannot exceed 100 characters']
    },
    currency: {
        type: String,
        required: [true, 'Currency is required'],
        default: 'INR',
        uppercase: true,
        minlength: [3, 'Currency code must be 3 characters'],
        maxlength: [3, 'Currency code must be 3 characters'],
        validate: {
            validator: function (currency: string) {
                return /^[A-Z]{3}$/.test(currency);
            },
            message: 'Currency must be a valid 3-letter ISO code'
        }
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    metadata: {
        type: MetadataSchema,
        default: () => ({
            climateZones: [],
            tags: []
        })
    },
}, {
    timestamps: true,  // Automatically adds createdAt and updatedAt
    versionKey: false, // Removes __v field
});

// Compound Indexes for better query performance
NurserySchema.index({ name: 'text', address: 'text' });
NurserySchema.index({ 'metadata.tags': 1 });
NurserySchema.index({ 'metadata.climateZones': 1 });
// NurserySchema.index({ location: '2dsphere' });

// Pre-save middleware for data normalization
// NurserySchema.pre('save', function (next) {
//     const nursery = this as any;
//     const nextFn = next as Function;
//     // Trim all string fields
//     if (nursery.name) nursery.name = nursery.name.toString().trim();
//     if (nursery.address) nursery.address = nursery.address.toString().trim();
//     if (nursery.contact) nursery.contact = nursery.contact.toString().trim();
//     if (nursery.currency) nursery.currency = nursery.currency.toString().toUpperCase().trim();

//     nextFn();
// });


const nurseryModel = model<NurseryInterface>("Nursery", NurserySchema);
export { nurseryModel }