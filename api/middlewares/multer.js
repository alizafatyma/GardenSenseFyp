const multer = require('multer');

// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Specify the directory where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Use a unique filename
    }
});

// Initialize multer middleware for multiple file uploads
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
}).array('images', 5);

module.exports = upload;
