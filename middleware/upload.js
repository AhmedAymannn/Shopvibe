const multer  = require('multer');
const path = require('path');

const storage = (folder) => multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, `../public/images/${folder}`));
    },
    filename: function (req, file, cb) {
        // Convert original filename to lowercase, replace spaces with underscores, and remove special characters
        const sanitizedFilename = file.originalname
            .toLowerCase()
            .replace(/\s+/g, "_") // Replace spaces with underscores
            .replace(/[^a-z0-9_.-]/g, ""); // Remove special characters except . _ and -

        // Add timestamp to avoid duplicates
        const uniqueFilename = `${Date.now()}-${sanitizedFilename}`;
        cb(null, uniqueFilename);
    }
});

const upload = (folder) => multer({ storage: storage(folder)});

module.exports = upload ;