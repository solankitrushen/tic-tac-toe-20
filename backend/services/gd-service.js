import gdRepository from "../database/repository/gd-repository.js";
import { APIError, STATUS_CODES, ValidationError } from "../utils/app-errors.js";
import sendEmail from "../mails/mail.js";

// All Business logic will be here
export default class gdService {
    constructor() {
        this.repository = new gdRepository();
    }

    async CreateGD(userId, body) {
        try {
            // Validate required fields
            const { gdTopic, gdDescription, gdDate, gdDuration, gdLink } = body;

            if (!gdTopic || !gdDescription || !gdDate || !gdDuration || !gdLink) {
                return {
                    message: "Please provide all required fields for the group discussion.",
                    status: 400
                };
            }

            // Add userId to the body
            body.userId = userId;

            // Create GD
            const gd = await this.repository.createGD(body);

            return {
                message: "Group Discussion created successfully!",
                gdId: gd.gdId,
                status: 201
            };
        } catch (err) {
            // Handle specific validation errors
            if (err instanceof ValidationError) {
                throw err;
            }

            // Handle other unhandled errors
            throw new APIError(
                "An error occurred while creating the group discussion.",
                STATUS_CODES.INTERNAL_ERROR,
                err.message,
                false,
                err.stack
            );
        }
    }

    async GetGDById(gdId) {
        try {
            const { status, gd, message } = await this.repository.FindGDById(gdId);

            if (status === 404) {
                return { message, status };
            }

            return {
                message: "Group Discussion retrieved successfully",
                gd,
                status: 200
            };
        } catch (err) {
            throw new APIError(
                "An error occurred while retrieving the group discussion",
                STATUS_CODES.INTERNAL_ERROR,
                err.message,
                false,
                err.stack
            );
        }
    }

    async GetUserGDs(userId) {
        try {
            const { status, gds, message } = await this.repository.FindGDsByUserId(userId);

            if (status === 404) {
                return { message, status };
            }

            return {
                message: "Group Discussions retrieved successfully",
                gds,
                status: 200
            };
        } catch (err) {
            throw new APIError(
                "An error occurred while retrieving user's group discussions",
                STATUS_CODES.INTERNAL_ERROR,
                err.message,
                false,
                err.stack
            );
        }
    }

    async GetAllGDs() {
        try {
            const { status, gds, message } = await this.repository.FindAllGDs();

            if (status === 404) {
                return { message, status };
            }

            return {
                message: "All Group Discussions retrieved successfully",
                gds,
                status: 200
            };
        } catch (err) {
            throw new APIError(
                "An error occurred while retrieving all group discussions",
                STATUS_CODES.INTERNAL_ERROR,
                err.message,
                false,
                err.stack
            );
        }
    }

    async UpdateGD(gdId, userId, body) {
        try {
            // First check if GD exists and belongs to the user
            const { gd } = await this.repository.FindGDById(gdId);

            if (!gd) {
                return {
                    message: "Group Discussion not found",
                    status: 404
                };
            }

            if (gd.userId !== userId) {
                return {
                    message: "You are not authorized to update this Group Discussion",
                    status: 403
                };
            }

            // If GD is already completed or cancelled, don't allow updates
            if (gd.gdStatus === "completed" || gd.gdStatus === "cancelled") {
                return {
                    message: `Cannot update a ${gd.gdStatus} Group Discussion`,
                    status: 400
                };
            }

            // Update GD
            const { status, message, gd: updatedGD } = await this.repository.UpdateGD(gdId, body);

            if (status === 404) {
                return { message, status };
            }

            return {
                message: "Group Discussion updated successfully",
                gd: updatedGD,
                status: 200
            };
        } catch (err) {
            throw new APIError(
                "An error occurred while updating the group discussion",
                STATUS_CODES.INTERNAL_ERROR,
                err.message,
                false,
                err.stack
            );
        }
    }

    async DeleteGD(gdId, userId) {
        try {
            // First check if GD exists and belongs to the user
            const { gd } = await this.repository.FindGDById(gdId);

            if (!gd) {
                return {
                    message: "Group Discussion not found",
                    status: 404
                };
            }

            if (gd.userId !== userId) {
                return {
                    message: "You are not authorized to delete this Group Discussion",
                    status: 403
                };
            }

            // Delete GD
            const { status, message } = await this.repository.DeleteGD(gdId);

            return { message, status };
        } catch (err) {
            throw new APIError(
                "An error occurred while deleting the group discussion",
                STATUS_CODES.INTERNAL_ERROR,
                err.message,
                false,
                err.stack
            );
        }
    }

    async MarkGDAsCompleted(gdId, userId) {
        try {
            // First check if GD exists and belongs to the user
            const { gd } = await this.repository.FindGDById(gdId);

            if (!gd) {
                return {
                    message: "Group Discussion not found",
                    status: 404
                };
            }

            if (gd.userId !== userId) {
                return {
                    message: "You are not authorized to update this Group Discussion",
                    status: 403
                };
            }

            // If GD is already completed or cancelled, don't allow updates
            if (gd.gdStatus === "completed") {
                return {
                    message: "Group Discussion is already marked as completed",
                    status: 400
                };
            }

            if (gd.gdStatus === "cancelled") {
                return {
                    message: "Cannot mark a cancelled Group Discussion as completed",
                    status: 400
                };
            }

            // Mark GD as completed
            const { status, message, gd: updatedGD } = await this.repository.UpdateGDStatus(gdId, "completed");

            // Could send a completion email here
            try {
                await sendEmail(
                    gd.email,
                    "Group Discussion Completed",
                    "gdCompletedMail",
                    {
                        Topic: gd.gdTopic,
                        Date: new Date(gd.gdDate).toLocaleDateString()
                    }
                );
            } catch (emailErr) {
                console.error("Failed to send email:", emailErr);
                // Don't throw error, just log it
            }

            return {
                message: "Group Discussion marked as completed",
                gd: updatedGD,
                status: 200
            };
        } catch (err) {
            throw new APIError(
                "An error occurred while marking the group discussion as completed",
                STATUS_CODES.INTERNAL_ERROR,
                err.message,
                false,
                err.stack
            );
        }
    }

    async CancelGD(gdId, userId) {
        try {
            // First check if GD exists and belongs to the user
            const { gd } = await this.repository.FindGDById(gdId);

            if (!gd) {
                return {
                    message: "Group Discussion not found",
                    status: 404
                };
            }

            if (gd.userId !== userId) {
                return {
                    message: "You are not authorized to cancel this Group Discussion",
                    status: 403
                };
            }

            // If GD is already completed or cancelled, don't allow updates
            if (gd.gdStatus === "cancelled") {
                return {
                    message: "Group Discussion is already cancelled",
                    status: 400
                };
            }

            if (gd.gdStatus === "completed") {
                return {
                    message: "Cannot cancel a completed Group Discussion",
                    status: 400
                };
            }

            // Cancel GD
            const { status, message, gd: updatedGD } = await this.repository.UpdateGDStatus(gdId, "cancelled");

            return {
                message: "Group Discussion cancelled successfully",
                gd: updatedGD,
                status: 200
            };
        } catch (err) {
            throw new APIError(
                "An error occurred while cancelling the group discussion",
                STATUS_CODES.INTERNAL_ERROR,
                err.message,
                false,
                err.stack
            );
        }
    }

    async AddFeedback(gdId, userId, body) {
        try {
            const { gdRating, gdFeedback } = body;

            if (!gdRating) {
                return {
                    message: "Rating is required for feedback",
                    status: 400
                };
            }

            // First check if GD exists and belongs to the user
            const { gd } = await this.repository.FindGDById(gdId);

            if (!gd) {
                return {
                    message: "Group Discussion not found",
                    status: 404
                };
            }

            if (gd.userId !== userId) {
                return {
                    message: "You are not authorized to add feedback to this Group Discussion",
                    status: 403
                };
            }

            // Only allow feedback for completed GDs
            if (gd.gdStatus !== "completed") {
                return {
                    message: "Can only add feedback to completed Group Discussions",
                    status: 400
                };
            }

            // Add feedback
            const { status, message, gd: updatedGD } = await this.repository.AddGDFeedback(
                gdId,
                gdRating,
                gdFeedback || ""
            );

            return {
                message: "Feedback added successfully",
                gd: updatedGD,
                status: 200
            };
        } catch (err) {
            throw new APIError(
                "An error occurred while adding feedback",
                STATUS_CODES.INTERNAL_ERROR,
                err.message,
                false,
                err.stack
            );
        }
    }
}