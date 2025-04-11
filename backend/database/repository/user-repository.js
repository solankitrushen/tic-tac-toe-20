import userModel from "../models/user.js";
import { APIError, STATUS_CODES, ValidationError } from "../../utils/app-errors.js";
import { paginateAndFilter } from "../../utils/index.js";

//Dealing with data base operations
export default class userRepository {

    async FetchUsers({ filters, page, limit, sort, excludeFields }) {
        try {
            const paginatedResults = await paginateAndFilter(userModel, { filters, page, limit, sort, excludeFields });
            // Return the paginated result
            return paginatedResults;

        } catch (err) {
            console.error(err);

            if (err.name === 'ValidationError') {
                throw new ValidationError("User validation failed: " + err.message, err.stack); // Use your custom ValidationError
            }
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to fetch user.",
                false,  // Set this to true if it's an operational error
                err.stack  // Log the error stack for better traceability
            );
        }
    }

    async FetchUserByUserId(id) {
        try {

            const user = await userModel.findOne(
                { userId: id }
            ).select(["-password", "-salt"]);
            return user;

        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to find user",
                false,
                err.stack
            );
        }
    }

    async UpdateUser(userId, body) {
        try {
            const user = await userModel.findOneAndUpdate(
                { userId },
                { $set: body },
                { new: true }
            );

            return user;
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to update user",
                false,  // Set this to true if it's an operational error
                err.stack  // Log the error stack for better traceability
            );
        }
    }

    async DeleteUser(user) {
        try {
            const deletedUser = await userModel.deleteOne({ userId: user.userId });

            return deletedUser;
        } catch (err) {
            console.log(err);
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to delete user",
                false,  // Set this to true if it's an operational error
                err.stack  // Log the error stack for better traceability
            );
        }
    }

    async FindUser({ email }) {
        try {
            const existingUser = await userModel.findOne({ email });
            if (!existingUser) return { message: "User not found", status: 404 }
            return { message: "User found successfully", user: existingUser };
        } catch (err) {
            console.log(err);
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Find user"
            );
        }
    }

}
