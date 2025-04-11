const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UN_AUTHORISED: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Base App Error
class AppError extends Error {
  constructor(
    name,
    statusCode,
    description,
    isOperational = true,
    errorStack = null,
    logErrorResponse = false
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorStack = errorStack;
    this.logError = logErrorResponse;
    Error.captureStackTrace(this);
  }
}

// API Specific Errors
class APIError extends AppError {
  constructor(
    name,
    statusCode = STATUS_CODES.INTERNAL_ERROR,
    description = "Internal Server Error",
    isOperational = true
  ) {
    super(name, statusCode, description, isOperational);
  }
}

// Bad Request Error
class BadRequestError extends AppError {
  constructor(description = "Bad Request", logErrorResponse = false) {
    super("BAD REQUEST", STATUS_CODES.BAD_REQUEST, description, true, null, logErrorResponse);
  }
}

// Validation Error (400)
class ValidationError extends AppError {
  constructor(description = "Validation Error", errorStack = null) {
    super("VALIDATION ERROR", STATUS_CODES.BAD_REQUEST, description, true, errorStack);
  }
}

// Unauthorized Error (403)
class UnauthorizedError extends AppError {
  constructor(description = "Unauthorized Access", logErrorResponse = false) {
    super("UNAUTHORIZED", STATUS_CODES.UN_AUTHORISED, description, true, null, logErrorResponse);
  }
}

// Not Found Error (404)
class NotFoundError extends AppError {
  constructor(description = "Resource Not Found") {
    super("NOT FOUND", STATUS_CODES.NOT_FOUND, description, true);
  }
}

// Service Unavailable Error (503)
class ServiceUnavailableError extends AppError {
  constructor(description = "Service Unavailable", logErrorResponse = true) {
    super("SERVICE UNAVAILABLE", STATUS_CODES.SERVICE_UNAVAILABLE, description, true, null, logErrorResponse);
  }
}

export { AppError, APIError, BadRequestError, ValidationError, UnauthorizedError, NotFoundError, ServiceUnavailableError, STATUS_CODES };
