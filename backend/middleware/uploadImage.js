import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, res, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
        
    } else {
        cb(new Error("Only image files allowed"), false);
    }
};

const uploadImage = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
})

export default uploadImage