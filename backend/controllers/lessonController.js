import Lesson from "../models/Lesson.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const uploadToCloudinary = (fileBuffer) => {
    return new Promise ((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {resource_type: "video", folder: "microlearning_videos"},
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
    }); 
};

const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId, {
        resource_type: "video"
    });
}

export const deleteLesson = async (req, res) => {
    try {
        const {id} = req.params;
        const lesson = await Lesson.findById(id);
        if(!lesson) {
            return res
            .status(404).json({message: "lesson not found"})
        }
        await deleteFromCloudinary(lesson.videoPublicId);
        const deletedLesson = await Lesson.findByIdAndDelete(id);

        return res
        .status(200).json({message: "lesson deleted successfully", data: deletedLesson})
    } catch (error) {
        return res
        .status(500).json({message: "error deleting lesson", error: error.message})
    }
}

export const updateLesson = async (req, res) => {
    try {
        const {id} = req.params
        const lesson = await Lesson.findById(id);
        if (!lesson) {
            return res
            .status(404).json({message: "lesson not found"});
        }
        if (req.file) {
            await deleteFromCloudinary(lesson.videoPublicId);

            const uploadResult = await uploadToCloudinary(req.file.buffer);
            lesson.videoUrl = uploadResult.secure_url;
            lesson.videoPublicId = uploadResult.public_id;
                                    
        }
            lesson.title = req.body.title ?? lesson.title;
            lesson.overview = req.body.overview ?? lesson.overview;
            lesson.duration = req.body.duration ?? lesson.duration;
            lesson.order = req.body.order ?? lesson.order;

            await lesson.save();


        return res
        .status(200).json({message: "lesson updated successfully", data: lesson})
    } catch (error) {
        return res
        .status(500).json({message: "error updating lesson", error: error.message})
    }
}