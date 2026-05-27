import fileUpload from "express-fileupload";

/**
 * File upload middleware - apply only to routes that handle file uploads
 * instead of running on every request globally.
 */
export const FileUploadMiddleware = fileUpload({ tempFileDir: "./" });
