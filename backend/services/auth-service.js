import authRepository from "../database/repository/auth-repository.js";
import {
  generateSalt,
  generatePassword,
  generateForgotPasswordSignature,
  validatePassword,
  validateSignature,
  generateSignature,
} from "../utils/index.js";
import { APIError, STATUS_CODES, ValidationError } from "../utils/app-errors.js";
import sendEmail from "../mails/mail.js";

// All Business logic will be here
export default class authService {
  constructor() {
    this.repository = new authRepository();
  }

  async Register(body) {
    const { email, password } = body;

    try {
      // Check for missing email or password
      if (!email || !password) {
        return {
          message: "Please enter both your email and password.",
          status: 400,
        };
      }

      // Check if the user already exists
      const { user: alreadyUser } = await this.repository.FindUser({ email });
      if (alreadyUser) {
        return {
          message: "User already registered.",
          status: 400,
        };
      }

      // Generate salt and hashed password
      let salt = await generateSalt();
      body.salt = salt;
      body.password = await generatePassword(password, salt);

      // Create new user
      const user = await this.repository.createUser(body);

      // Generate token for email verification
      const token = await generateSignature({
        email: email,
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      const verificationUrl = `${process.env.MAIN_FRONTEND_URL}/auth/verify/${token}`;
      // console.log(verificationUrl);

      await sendEmail(email, "Welcome to BackendHub", "welcomeMail", { Name: `${user.firstName} ${user.lastName}`, Link: verificationUrl })
      await sendEmail(email, "Verify Email", "verificationLinkMail", { Name: `${user.firstName} ${user.lastName}`, Link: verificationUrl })

      // Return success message with status code 201 (Created)
      return {
        message: "User created successfully! Please verify your email address.",
        status: 201,
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

  async Login(body) {
    const { email, password } = body;
    if (!email || !password) {
      return {
        message: "Provide email and password",
        status: 400
      };
    }
    try {
      // Check if the user exists
      const { user: existingUser } = await this.repository.FindUser({ email });

      // If user does not exist
      if (!existingUser) {
        return {
          message: "User not found",
          status: 404
        };
      }

      // Check if the user is verified
      if (!existingUser.isVerified) {
        return {
          message: "User account is not verified. Please check your email.",
          status: 401
        };
      }

      // Validate password
      const validPassword = await validatePassword(password, existingUser.password, existingUser.salt);

      if (!validPassword) {
        return {
          message: "Invalid password",
          status: 400
        };
      }

      // Generate token upon successful login
      const token = await generateSignature({
        email: existingUser.email,
        userId: existingUser.userId,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
      });

      return {
        message: "User logged in successfully",
        token,
        status: 200
      };

    } catch (err) {
      // General error handling
      throw new APIError("An error occurred while login a user",
        STATUS_CODES.INTERNAL_ERROR,
        err.message,
        false,
        err.stack
      );
    }
  }

  async OAuthSignIn(body) {
    const { email } = body;
    if (!email) {
      return {
        message: "Provide email",
        status: 400
      };
    }
    try {
      // Check if the user exists
      const { user: existingUser } = await this.repository.FindUser({ email });

      // If user does not exist
      if (!existingUser) {
        return {
          message: "User not found. Complete your Profile to create one User.",
          status: 200
        };
      }

      // Check if the user is verified
      if (!existingUser.isVerified) {
        return {
          message: "User exist but user account is not verified. Please check your email.",
          status: 401
        };
      }

      // Generate token upon successful login
      const token = await generateSignature({
        email: existingUser.email,
        userId: existingUser.userId,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
      });

      return {
        message: "User logged in successfully",
        token,
        status: 200
      };

    } catch (err) {
      // General error handling
      throw new APIError("An error occurred while login a user",
        STATUS_CODES.INTERNAL_ERROR,
        err.message,
        false,
        err.stack
      );
    }
  }

  async VerifyToken(req, token) {
    try {
      // Check if the token is provided
      if (!token) {
        return {
          message: "Token is missing",
          status: 401
        };
      }

      // Validate the token
      const validatedSignature = await validateSignature(req, token);

      if (!validatedSignature) {
        return {
          message: "Invalid or expired token.",
          status: 401
        };
      }

      // If signature is valid, verify the user
      const updatedUser = await this.repository.VerifyUser(req.user);

      if (!updatedUser) {
        return {
          message: "User not found.",
          status: 404
        };
      }

      // Return success response
      return {
        message: "User verified successfully.",
        status: 200
      };

    } catch (err) {
      // Handle specific errors or fallback to general error
      throw new APIError("An error occurred during token verification",
        STATUS_CODES.INTERNAL_ERROR,
        err.message,
        false,
        err.stack
      );
    }
  }

  async Me(user) {
    try {

      const { user: existingUser } = await this.repository.FindUser({
        email: user.email,
      });
      if (!existingUser) {
        return {
          message: "User not found",
          status: 404
        };
      }

      return {
        message: "User is authenticated",
        status: 200,
        userId: existingUser.userId,
        firstName: existingUser.firstName,
        middleName: existingUser.middleName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        mobileNo: existingUser.mobileNo,
        DOB: existingUser.DOB,
        countryCallingCode: existingUser.countryCallingCode,
        profileImageUrl: existingUser.profileImageUrl,
      };
    } catch (err) {
      throw new APIError("error while fetching user details ",
        STATUS_CODES.INTERNAL_ERROR,
        err.message,
        false,
        err.stack
      );
    }
  }

  async forgotPasswordRequestUrl(body) {
    const { email } = body;
    if (!email) {
      return {
        message: "Please enter email",
        status: 400
      };
    }
    try {
      const { user: existingUser } = await this.repository.FindUser({ email });

      if (existingUser && existingUser.isVerified) {
        const token = await generateForgotPasswordSignature({
          email: existingUser.email,
        });
        const forgotPasswordUrl = `${process.env.MAIN_FRONTEND_URL}/auth/forgotPassword/${token}`;
        console.log(forgotPasswordUrl);

        // TODO: make forgot password mail template 
        await sendEmail(email, "Forgot Password Link", "verificationLinkMail", { Name: `${existingUser.firstName} ${existingUser.lastName}`, Link: forgotPasswordUrl });

        return {
          message: "you will be able to forgot your password. We sent you a mail.",
          status: 200,
        };
      }
      return {
        message: "please verify your email first",
        status: 401,
      };
    } catch (err) {
      throw new APIError("Error occurred while creating request url for password change",
        STATUS_CODES.INTERNAL_ERROR,
        err.message,
        false,
        err.stack
      );
    }
  }

  async ChangeUserPassword(req, token, newPassword) {
    if (!newPassword) {
      return {
        message: "new password is required",
        status: 400
      }
    }
    try {
      const ValidatedSignature = await validateSignature(req, token);
      if (!ValidatedSignature) {
        return {
          message: "Invalid or expired token.",
          status: 401,
        };
      }

      const newSalt = await generateSalt();
      const password = await generatePassword(newPassword, newSalt);
      const user = await this.repository.forgotUserPassword(
        req.user.email,
        password,
        newSalt
      );

      if (!user) {
        return {
          message: "User not found.",
          status: 404,
        }
      }
      return {
        message: "Password updated successfully.",
        status: 200,
      };
    } catch (err) {
      throw new APIError("Error occurred while updating password",
        STATUS_CODES.INTERNAL_ERROR,
        err.message,
        false,
        err.stack
      );
    }
  }

  async ChangePassword(req, body) {
    console.log(body)
    if (!body.newPassword) {
      return {
        message: "new password is required",
        status: 401
      }
    }
    try {
      const { user: existingUser } = await this.repository.FindUser({ email: req.user.email });
      console.log(existingUser)
      const isVerified = await validatePassword(body.currentPassword, existingUser.password, existingUser.salt);
      console.log(isVerified);
      if (!isVerified) {
        return {
          message: "Old password is  not valid",
          status: 400
        }
      }
      const newSalt = await generateSalt();
      const password = await generatePassword(body.newPassword, newSalt);
      const user = await this.repository.forgotUserPassword(
        req.user.email,
        password,
        newSalt
      );

      if (!user) {
        return {
          message: "User not found.",
          status: 404,
        }
      }
      return {
        message: "Password updated successfully.",
        status: 200,
      };
    } catch (err) {
      throw new APIError("Error occurred while updating password",
        STATUS_CODES.INTERNAL_ERROR,
        err.message,
        false,
        err.stack
      );
    }
  }

}



