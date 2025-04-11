import multer from 'multer';
import sharp from 'sharp';
import { APIError, STATUS_CODES } from './app-errors.js';

// Helper function to generate filenames
const generateFilename = (prefix, id) => {
  const timestamp = Date.now();
  if (id) return `${prefix}-${id}-${timestamp}.jpeg`;
};

// Configure multer to store files in memory
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new APIError(
        "Image type not supported! Please upload a valid image.",
        400
      )
    );
  }
};

// Configure upload limits and storage
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB size limit
});

// Generic function to resize and save images
const resizeImage = async (req, res, next, type) => {
  if (!req.file) return next(); // No file uploaded

  try {
    const { user, body } = req;
    console.log(user)
    // Determine the filename based on the type of image
    if (type === 'profile') {
      req.body.profilePic = generateFilename('user', user?.userId);
    } else if (type === 'project') {
      req.body.projectCover = generateFilename('project', body.projectId);
    }

    // Resize and save the image using Sharp
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${type === 'profile' ? req.body.profilePic : req.body.projectCover}`);

    next();
  } catch (err) {
    // console.log(err)
    throw new APIError(
      "Error processing image",
      STATUS_CODES.INTERNAL_ERROR,
      err.message,
      false,
      err.stack
    );
  }
};

// Middleware for resizing user photos
const resizeUserPhoto = (req, res, next) => resizeImage(req, res, next, 'profile');

// Middleware for resizing project covers
const resizeProjectCover = (req, res, next) => resizeImage(req, res, next, 'project');

export { upload, resizeUserPhoto, resizeProjectCover };
