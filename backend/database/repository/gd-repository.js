import gdModel from "../models/gd.js";
import { APIError, STATUS_CODES, ValidationError } from "../../utils/app-errors.js";

//Dealing with data base operations
export default class gdRepository {
    async createGD(body) {
        try {
            const gd = await gdModel.create(body);

            if (!gd) {
                throw new APIError(
                    "Group Discussion Creation Failed",
                    STATUS_CODES.BAD_REQUEST,
                    "Unable to create group discussion."
                );
            }

            // Return gd object if successful
            return gd;
        } catch (err) {
            console.error(err);

            if (err.name === 'ValidationError') {
                throw new ValidationError("Group Discussion validation failed: " + err.message, err.stack);
            }
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to create group discussion.",
                false,
                err.stack
            );
        }
    }

    async FindGDById(gdId) {
        try {
            const gd = await gdModel.findOne({ gdId });
            if (!gd) return { message: "Group Discussion not found", status: 404 };
            return { message: "Group Discussion found successfully", gd };
        } catch (err) {
            console.log(err);
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to find group discussion"
            );
        }
    }

    async FindGDsByUserId(userId) {
        try {
            const gds = await gdModel.find({ userId });
            if (!gds || gds.length === 0) return { message: "No Group Discussions found", status: 404 };
            return { message: "Group Discussions found successfully", gds };
        } catch (err) {
            console.log(err);
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to find group discussions"
            );
        }
    }

    async FindAllGDs() {
        try {
            const gds = await gdModel.find({});
            if (!gds || gds.length === 0) return { message: "No Group Discussions found", status: 404 };
            return { message: "Group Discussions found successfully", gds };
        } catch (err) {
            console.log(err);
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to find group discussions"
            );
        }
    }

    async UpdateGD(gdId, updateData) {
        try {
            const updatedGD = await gdModel.findOneAndUpdate(
                { gdId },
                updateData,
                { new: true }
            );

            if (!updatedGD) {
                return { message: "Group Discussion not found", status: 404 };
            }

            return { message: "Group Discussion updated successfully", gd: updatedGD };
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to update group discussion",
                false,
                err.stack
            );
        }
    }

    async DeleteGD(gdId) {
        try {
            const deletedGD = await gdModel.findOneAndDelete({ gdId });

            if (!deletedGD) {
                return { message: "Group Discussion not found", status: 404 };
            }

            return { message: "Group Discussion deleted successfully", status: 200 };
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to delete group discussion",
                false,
                err.stack
            );
        }
    }

    async UpdateGDStatus(gdId, status) {
        try {
            const updatedGD = await gdModel.findOneAndUpdate(
                { gdId },
                { gdStatus: status },
                { new: true }
            );

            if (!updatedGD) {
                return { message: "Group Discussion not found", status: 404 };
            }

            return { message: `Group Discussion marked as ${status}`, gd: updatedGD };
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to update group discussion status",
                false,
                err.stack
            );
        }
    }

    async AddGDFeedback(gdId, rating, feedback) {
        try {
            const updatedGD = await gdModel.findOneAndUpdate(
                { gdId },
                {
                    gdRating: rating,
                    gdFeedback: feedback,
                    gdStatus: "completed"
                },
                { new: true }
            );

            if (!updatedGD) {
                return { message: "Group Discussion not found", status: 404 };
            }

            return { message: "Feedback added successfully", gd: updatedGD };
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to add feedback",
                false,
                err.stack
            );
        }
    }
}