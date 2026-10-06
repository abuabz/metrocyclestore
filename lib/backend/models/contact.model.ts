import mongoose, { Document, Schema } from "mongoose";


export interface IContact extends Document {
    contactId: string;
    M07_name: string;
    M07_place: string;
    M07_district: string;
    M07_pincode: string;
    M07_phone_number: string;
    M07_warranty_card_photo: string[] | null;
    M07_cycle_image: string[] | null;
    M07_status: "active" | "inactive" | "pending";
    M07_deleted_at: Date | null;
}

const ContactSchema: Schema<IContact> = new Schema(
    {
        contactId: {
            type: String,
            required: true,
            unique: true,
        },
        M07_name: {
            type: String,
            required: true,
        },
        M07_place: {
            type: String,
            required: true,
        },
        M07_district: {
            type: String,
            required: true,
        },
        M07_pincode: {
            type: String,
            required: true,
        },
        M07_phone_number: {
            type: String,
            required: true,
        },
        M07_warranty_card_photo: {
            type: [String],
            default: [],
        },
        M07_cycle_image: {
            type: [String],
            default: [],
        },
        M07_status: {
            type: String,
            enum: ["To do", "Doing", "Completed",],
            default: "active",
        },
        M07_deleted_at: {
            type: Date,
            default: null,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

export const Contact = mongoose.model<IContact>("M07_contact", ContactSchema);