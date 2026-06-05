import multer from "multer";
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
        cb(null, true);
    } else {
        cb(new Error("only video files are allowed"), false)
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize: 100 * 1024 * 1024}
})
export default upload;

