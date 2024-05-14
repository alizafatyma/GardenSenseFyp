const multer = require('multer');

// Define storage for uploaded files
const Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); 
    }
});

// Initialize multer middleware for single file upload - Configuration for plant identification image
const uploadPlantImage = multer({
    storage: Storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
}).single('image');


// Initialize multer middleware for multiple file uploads - Configuration for post images
const uploadPostImages = multer({
    storage: Storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
}).array('images', 5); // Allow up to 5 images to be uploaded

module.exports = { uploadPlantImage, uploadPostImages };