import userModel from "../models/user.js";
import { APIError, STATUS_CODES, ValidationError } from "../../utils/app-errors.js";

//Dealing with data base operations
export default class authRepository {

  async createUser(body) {
    try {
      // console.log("body in auth-repository", body);
      const user = await userModel.create(body);

      if (!user) {
        throw new APIError(
          "User Creation Failed",
          STATUS_CODES.BAD_REQUEST,
          "Unable to create user."
        );
      }

      // Return user object if successful
      return user;

    } catch (err) {
      console.error(err);

      if (err.name === 'ValidationError') {
        throw new ValidationError("User validation failed: " + err.message, err.stack); // Use your custom ValidationError
      }
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to create user.",
        false,  // Set this to true if it's an operational error
        err.stack  // Log the error stack for better traceability
      );
    }
  }

  async VerifyUser(user) {
    try {

      const updatedUser = await userModel.findOneAndUpdate(
        {
          userId: user.userId,
        },
        {
          $set: { isVerified: true },
        },
        { new: true }
      );

      return updatedUser;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create user",
        false,
        err.stack
      );
    }
  }
  async forgotUserPassword(email, newPassword, newSalt) {
    try {
      const user = await userModel.findOneAndUpdate(
        { email: email },
        { $set: { password: newPassword, salt: newSalt } },
        { new: true }
      );

      return user;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to update password",
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

  async UpdateUser(req, updateData) {
    try {
      const updatedUser = await userModel.findOneAndUpdate(
        { userId: req.user.userId },
        updateData,
        { new: true }
      );
      return updatedUser;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find user"
      );
    }
  }


}
