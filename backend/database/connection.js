import mongoose from "mongoose";
import { DB_URL } from "../config/index.js";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Db Connected");
  } catch (error) {
    console.error(" ============================================== Error ==============================================");
    console.error(error);
    process.exit(1);
  }
};

export default connectToDatabase;
