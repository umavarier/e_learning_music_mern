const multer = require('multer');

//uploads category img
const multerStorageCategory = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/certificates");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
        
    }
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads'); // Specify the upload directory
    console.log("multer")
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
  },
});


const multerStorageCertificates = multer.diskStorage({
    destination: function (req, file, cb) {
     
      cb(null, './public/certificates'); // Store certificates in the 'certificates' subdirectory
    },
    filename: function (req, file, cb) {
      // Generate a unique filename using the current timestamp and the file's original name
      const certificateFileName = `${Date.now()}-${file.originalname}`;
      cb(null, certificateFileName);
    },
  });
  
const uploadSingleFile = multer({ storage: storage }).fields([{ name: 'image', maxCount: 1 }])
const uploadSingleCertificate = multer({ storage: multerStorageCertificates }).single('certificate');
// const upload = multer({ storage: storage });


module.exports = {
     uploadSingleFile,
     uploadSingleCertificate,
}