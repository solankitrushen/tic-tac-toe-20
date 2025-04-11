import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomBytes } from 'crypto';
import { APIError, STATUS_CODES } from './app-errors.js';

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

/**
 * 
 * @param {Buffer} fileBuffer - The image buffer to upload.
 * @param {string} fileName - The original name of the file.
 * @param {string} bucketPath - The path inside the S3 bucket where the file will be stored.
 * @param {string} bucketName - The name of the S3 bucket.
 * @returns {Promise} - A promise that resolves to the S3 file URL.
 */
const uploadFileToS3 = async (fileBuffer, fileName, bucketPath, bucketName, ContentType) => {
  try {
    const randomString = randomBytes(16).toString('hex');
    const cleanFileName = fileName.replace(/\s+/g, ''); // Remove spaces from file name
    const s3FileName = `${randomString}-${Date.now()}-${cleanFileName}`;
    const filePath = `${bucketPath}/${s3FileName}`; // Full file path in the S3 bucket

    const uploadParams = {
      Bucket: bucketName,
      Key: filePath,
      Body: fileBuffer,
      ContentType: ContentType,
      ACL: 'public-read',
    };

    // Perform the upload
    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    // Return the file URL
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${filePath}`;
  } catch (err) {
    throw new APIError(
      `File upload failed: ${err.message}`,
      STATUS_CODES.INTERNAL_ERROR,
      err.message,
      false,
      err.stack
    );
  }
};

export default uploadFileToS3;
