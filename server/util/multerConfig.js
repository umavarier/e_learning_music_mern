const multer = require('multer');
const path = require('path');

// Multer storage configuration for profile photo
const profilePhotoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `profile-${Date.now()}${ext}`);
  },
});
const certificateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/certificates'); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `certificate-${Date.now()}${ext}`);
  },
});

// Multer storage configuration for PDF
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/pdf-files');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `pdf-${Date.now()}${ext}`);
  },
});

// Multer storage configuration for video files
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/video-files');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `video-${Date.now()}${ext}`);
  },
});

// Multer storage configuration for Instagram Reels
const reelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/instagram-reels');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `reel-${Date.now()}${ext}`);
  },
});
const logRequestMiddleware = (req, res, next) => {
    console.log('File upload request received.');
    next(); // Continue to the next middleware or route handler
  };

// Multer upload middleware instances
const uploadProfilePhoto = multer({ storage: profilePhotoStorage });
const uploadPdf = multer({ storage: pdfStorage });
const uploadVideo = multer({ storage: videoStorage });
const uploadReel = multer({ storage: reelStorage });
const uploadCertificate = multer({ storage: certificateStorage });

module.exports = {
  uploadProfilePhoto,
  uploadPdf,
  uploadVideo,
  uploadReel,
  logRequestMiddleware,
  uploadCertificate,
};
