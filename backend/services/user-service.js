import userRepository from "../database/repository/user-repository.js";
import { APIError, BadRequestError, STATUS_CODES, ValidationError } from "../utils/app-errors.js";
import uploadFileToS3 from "../utils/S3Config.js";

// All Business logic will be here
export default class userService {
    constructor() {
        this.repository = new userRepository();
    }

    async FetchUsers({ filters = {}, page = 1, limit = 20, sort = {}, excludeFields = ["password", 'salt'] }) {
        try {
            // Check if the user already exists
            const result = await this.repository.FetchUsers({ filters, page, limit, sort, excludeFields });
            if (!result) {
                throw new BadRequestError("Users Not found.");
            }
            if (!result.data.length) {
                return {
                    message: "No users found with the given criteria.",
                    status: 404,
                };
            }
            // Return success message with status code 201 (Created)
            return {
                message: "Users fetched successfully!",
                status: 200,
                data: result.data,
                totalDocuments: result.totalDocuments,
                totalPages: result.totalPages,
                currentPage: result.currentPage,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage
            };

        } catch (err) {
            // Handle specific validation errors(e.g., Mongoose validation errors)
            if (err instanceof ValidationError) {
                throw err; // Already a ValidationError
            }

            // Handle other unhandled errors by throwing APIError
            throw new APIError("An error occurred while creating the user.",
                STATUS_CODES.INTERNAL_ERROR,
                err.message,
                false,
                err.stack
            );
        }
    }

    async UploadProfilePhoto(file) {
        try {
            const fileBuffer = file.buffer;
            const fileName = file.originalname;
            const bucketPath = 'profileImages';
            const bucketName = "Add your own bucket name"; // Add your own bucket name

            const s3FileUrl = await uploadFileToS3(
                fileBuffer,
                fileName,
                bucketPath,
                bucketName,
            );
            if (!s3FileUrl) {
                return {
                    message: "Error occurred while uploading profile",
                    status: 400
                };
            }

            return {
                message: "Profile img uploaded successfully!!",
                status: 200,
                imgUrl: s3FileUrl
            };
        } catch (err) {
            throw new APIError(
                "Error occurred while uploading profile",
                STATUS_CODES.INTERNAL_ERROR,
                err.message,
                false,
                err.stack
            );
        }
    }

    async FetchUserByUserId(id) {
        try {
            // Check if the user exists
            const user = await this.repository.FetchUserByUserId(id);

            // If user does not exist
            if (!user) {
                return {
                    message: "User not found",
                    status: 404
                };
            }

            return {
                message: "User Found successfully!",
                status: 200,
                user
            };

        } catch (err) {
            throw new APIError(
                "Error occurred while Fetching user by user id",
                STATUS_CODES.INTERNAL_ERROR,
                err.message,
                false,
                err.stack
            );
        }
    }

    async UpdateUser(req, body) {
        try {

            const { user: existingUser } = await this.repository.FindUser({ email: req.user.email });
            if (!existingUser) {
                return {
                    message: "User not found.",
                    status: 404
                };
            }

            if (existingUser.isDeleted) {
                return {
                    message: "This user account has been deleted and cannot be updated.",
                    status: 403
                };
            }

            // Define the fields that are allowed to be updated
            const allowedFields = ['firstName', 'middleName', 'lastName', 'DOB', 'gender', 'profileImageUrl'];

            // Filter the body to only include allowed fields
            const updates = {};
            Object.keys(body).forEach(key => {
                if (allowedFields.includes(key)) {
                    updates[key] = body[key];
                }
            });

            // If the body contains no valid fields to update
            if (Object.keys(updates).length === 0) {
                return {
                    message: "No valid fields provided for update.",
                    status: 400
                };
            }


            // Update the user in the database
            const updatedUser = await this.repository.UpdateUser(req.user.userId, updates);

            // If the user is not found
            if (!updatedUser) {
                return {
                    message: "User not found",
                    status: 404
                };
            }

            return {
                message: "User updated successfully!",
                status: 200,
                updatedUser
            };

        } catch (err) {
            // General error handling
            throw new APIError(
                "Error occurred while updating user",
                STATUS_CODES.INTERNAL_ERROR,
                err.message,
                false,
                err.stack
            );
        }
    }


    async DeleteUser(req) {
        try {

            const deletedUser = await this.repository.DeleteUser(req.user);

            if (!deletedUser) {
                return {
                    message: "User not deleted successfully.",
                    status: 400
                };
            }

            return {
                message: "User deleted successfully.",
                status: 200
            };

        } catch (err) {
            throw new APIError(
                "Error occurred while deleting user",
                STATUS_CODES.INTERNAL_ERROR,
                err.message,
                false,
                err.stack
            );
        }
    }

}



