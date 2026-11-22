import path from 'path';
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

const storage = multer.memoryStorage();

export const validateMagicBytes = (buffer: Buffer, mimetype: string): boolean => {
  if (!buffer || buffer.length < 4) return false;

  // PDF: %PDF- (0x25 0x50 0x44 0x46)
  if (mimetype === 'application/pdf') {
    return buffer.slice(0, 5).toString('ascii').startsWith('%PDF-');
  }

  // PNG: \x89PNG\r\n\x1a\n (0x89 0x50 0x4E 0x47)
  if (mimetype === 'image/png') {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4E &&
      buffer[3] === 0x47
    );
  }

  // JPEG: 0xFF 0xD8 0xFF
  if (mimetype === 'image/jpeg') {
    return buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
  }

  // WebP: RIFF .... WEBP
  if (mimetype === 'image/webp') {
    if (buffer.length < 12) return false;
    const riff = buffer.slice(0, 4).toString('ascii');
    const webp = buffer.slice(8, 12).toString('ascii');
    return riff === 'RIFF' && webp === 'WEBP';
  }

  // Legacy Word .doc (OLE CF): 0xD0 0xCF 0x11 0xE0
  if (mimetype === 'application/msword') {
    return (
      buffer[0] === 0xD0 &&
      buffer[1] === 0xCF &&
      buffer[2] === 0x11 &&
      buffer[3] === 0xE0
    );
  }

  // Modern Word .docx (ZIP archive): PK\x03\x04 or PK\x05\x06 or PK\x07\x08
  if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return (
      buffer[0] === 0x50 &&
      buffer[1] === 0x4B &&
      (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07)
    );
  }

  return false;
};

export const validateUploadMagicBytes = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }

  const isValid = validateMagicBytes(req.file.buffer, req.file.mimetype);
  if (!isValid) {
    return res.status(400).json({
      error: {
        code: 'INVALID_FILE_SIGNATURE',
        message: 'File content does not match its claimed extension or MIME type. Upload rejected.',
      },
    });
  }

  next();
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only PDF, DOCX, JPEG, and PNG are supported.'));
    }
  },
});

export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/\.{2,}/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 100);
};

export const resumeUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (_req, file, cb) => {
    const allowedResumeMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedResumeMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid resume format. Only PDF, DOC, and DOCX documents up to 5MB are allowed.'));
    }
  },
});

