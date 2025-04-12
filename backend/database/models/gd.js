import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

const gdSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
            default: uuid,
        },
        gdId: {
            type: String,
            required: true,
            unique: true,
            default: uuid,
        },
        gdTopic: {
            type: String,
            required: true,
        },
        gdDescription: {
            type: String,
            required: true,
        },
        gdDate: {
            type: Date,
            required: true,
        },
        gdDuration: {
            type: Number,
            required: true,
        },
        gdLink: {
            type: String,
            required: true,
        },
        gdStatus: {
            type: String,
            enum: ["scheduled", "completed", "cancelled"],
            default: "scheduled",
        },
        gdRating: {
            type: Number,
            min: 1,
            max: 5,
        },
        gdFeedback: {
            type: String,
        },
    },
    {
        timestamps: true,
        // toJSON: {
        //   transform(doc, ret) {
        //     delete ret.password;
        //     delete ret.salt;
        //     return ret;
        //   }
        // },
        // toObject: {
        //   transform(doc, ret) {
        //     delete ret.password;
        //     delete ret.salt;
        //     return ret;
        //   }
        // }
    }
);

const gdModel = mongoose.model("gdDetails", gdSchema);

export default gdModel;
