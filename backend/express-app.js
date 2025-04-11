import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";  // Prevent NoSQL injection
import xss from "xss-clean";  // Prevent XSS attacks
import hpp from "hpp";  // Prevent HTTP parameter pollution
import morgan from "morgan";  // Request logging for development
import auth from "./api/auth.js";
import HandleErrors from "./utils/error-handler.js";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { setupSwagger } from "./utils/index.js";
import user from "./api/user.js";

const expressApp = async (app) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(express.static(path.join(__dirname, "public")));

  // Helmet for setting HTTP security headers
  app.use(helmet());

  // Data sanitization against NoSQL query injection
  app.use(mongoSanitize());

  // Data sanitization against XSS
  app.use(xss());

  // Prevent HTTP Parameter Pollution
  app.use(hpp());

  // Enable CORS
  app.use(
    cors({
      origin: (process.env.CLIENT_URLS || 'http://localhost:3000').split(','),
      methods: ["GET", "POST", "UPDATE", "DELETE"],
      credentials: true,
    })
  );

  // Development Logging
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));  // Log requests in dev mode
  }

  app.get('/', (req, res, next) => {
    res.status(200).json({
      message: "Welcome to the default backend of BackendHub.",
      apiDocs: {
        description: "You can find the API documentation at the following link:",
        link: "http://localhost:8000/api-docs"
      }
    });
  });

  // Setup Swagger
  setupSwagger(app);

  // API routes
  auth(app);
  user(app)

  // Error handling
  app.use(HandleErrors);
};

export default expressApp;
