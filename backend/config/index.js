import dotEnv from "dotenv";

const configFile = `./.env.${process.env.NODE_ENV}`;
dotEnv.config({ path: configFile });

export const DB_URL = process.env.MONGODB_URI;