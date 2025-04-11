import nodemailer from "nodemailer";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import ejs from "ejs";
import userModel from "../database/models/user.js";
import {
  BadRequestError,
  NotFoundError,
  ValidationError,
  ServiceUnavailableError,
  UnauthorizedError,
  STATUS_CODES,
  AppError
} from "../utils/app-errors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_APP_PASSWORD,
  },
});

// Function to render email template with error handling
function renderTemplate(templateName, data = {}) {
  const templatePath = path.join(__dirname, "mailTemplates", `${templateName}.ejs`);
  try {
    if (!fs.existsSync(templatePath)) {
      throw new NotFoundError(`Email template ${templateName} not found`);
    }

    const templateContent = fs.readFileSync(templatePath, "utf8");
    return ejs.render(templateContent, data);
  } catch (error) {
    throw new BadRequestError(`Failed to render template: ${error.message}`);
  }
}

// Function to send an email with error handling
async function sendMailToUser({ to, subject, html }) {
  const mailOptions = {
    from: process.env.MAIL_ID,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info.response;
  } catch (error) {
    // SMTP-specific errors (e.g., auth or service down)
    if (error.responseCode === STATUS_CODES.SERVICE_UNAVAILABLE) {
      throw new ServiceUnavailableError("Mail service is unavailable. Please try again later.");
    } else if (error.responseCode === STATUS_CODES.UN_AUTHORISED) {
      throw new UnauthorizedError("SMTP Authentication failed. Check your credentials.");
    }
    throw new BadRequestError(`Email sending failed: ${error.message}`);
  }
}

// Unified function to send dynamic emails with error handling
async function sendEmail(userEmail, subject, templateName, templateData = {}) {
  try {
    // Validate email
    if (!userEmail || !userEmail.includes("@")) {
      throw new ValidationError("Invalid email address provided");
    }

    // Fetch user details
    const user = await userModel.findOne({ email: userEmail });
    if (!user) {
      throw new NotFoundError(`User with email ${userEmail} not found`);
    }

    // Render the email template
    const html = renderTemplate(templateName, templateData);

    // Send email
    const response = await sendMailToUser({ to: userEmail, subject, html });
    console.log(`${subject} Email sent:`, response);
  } catch (error) {
    if (error instanceof AppError) {
      console.error(`AppError: ${error.message}`);
      if (error.logError) {
        // Log the error to a logging service or file
      }
    } else {
      console.error(`Unexpected Error: ${error.message}`);
    }
    throw error; // Re-throw the error after handling it
  }
}

export default sendEmail;
