import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { promises as fs } from 'fs';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerFilePath = path.join(__dirname, './swagger.json'); // Adjust the path as needed

export async function setupSwagger(app) {
  try {
    const swaggerDocument = JSON.parse(await fs.readFile(swaggerFilePath, 'utf8'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } catch (error) {
    console.error('Error loading swagger.json:', error);
  }
}

//Utility functions
export const generateSalt = async () => {
  return await bcrypt.genSalt();
};

export const generatePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

export const validatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await generatePassword(enteredPassword, salt)) === savedPassword;
};

export const generateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const validateSignature = async (req, signature) => {
  try {
    const payload = await jwt.verify(signature, process.env.JWT_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const generateForgotPasswordSignature = async (payload) => {
  try {
    return await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  } catch (error) {
    console.log(error);
    return error;
  }
};


// Utility function to handle pagination and filtering
export const paginateAndFilter = async (model, queryOptions = {}) => {
  const { filters = {}, page = 1, limit = 10, sort = {}, excludeFields = [] } = queryOptions;

  // Calculate the number of documents to skip
  const skip = (page - 1) * limit;

  // Build the query and conditionally deselect fields
  const query = model.find(filters).skip(skip).limit(limit).sort(sort);

  // Exclude specified fields if provided
  if (excludeFields.length > 0) {
    query.select(excludeFields.map(field => `-${field}`).join(' '));
  }

  try {
    // Fetch the documents with filters and pagination
    const [results, totalDocuments] = await Promise.all([
      query.exec(),
      model.countDocuments(filters)  // Get total document count for filters
    ]);

    // Return the paginated results, total document count, and pagination info
    return {
      data: results,
      totalDocuments,
      totalPages: Math.ceil(totalDocuments / limit),
      currentPage: page,
      hasNextPage: page * limit < totalDocuments,
      hasPrevPage: page > 1
    };
  } catch (err) {
    throw new Error("Error occurred during pagination and filtering: " + err.message);
  }
};
