import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDirectory = 'uploads';

// Make sure upload directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Storage engine config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// File validation helper
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpg|jpeg|png|webp/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only JPG, JPEG, PNG, and WEBP images are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export default upload;
