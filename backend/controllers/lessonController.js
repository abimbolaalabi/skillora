import Lesson from "../models/Lesson.js";
import cloudinary from "../config/cloudinary.js"

const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId, {
        resource_type: "video"
    })
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
        const updatedLesson = await Lesson.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        })
        return res
        .status(200).json({message: "lesson updated successfully", data: updatedLesson})
    } catch (error) {
        return res
        .status(500).json({message: "error updating lesson", error: error.message})
    }
}