import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      default: uuid,
    },
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    DOB: {
      type: Date,
    },
    email: {
      type: String,
      required: true,
      match: [/\S+@\S+\.\S+/, 'Invalid email format'], // Ensures the email is in a valid format
      unique: true,
    },
    mobileNo: {
      type: Number,
    },
    countryCallingCode: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
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

const userModel = mongoose.model("userDetails", userSchema);

export default userModel;
