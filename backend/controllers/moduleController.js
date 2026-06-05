import Module from "../models/Module.js";
import Lesson from "../models/Lesson.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";


// TODO: createModule, getModules, getModuleById, updateModule, publishModule, deleteModule

// upload to cloudinary
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
    })
}

// New Module
export const createModule = async (req, res) =>{
    try {
        const {title, description, reflectionQuestion, duration} = req.body
                
        const newModule = await Module.create({
            title,
            description,
            createdBy: req.user.id,
            reflectionQuestion,
            duration
        })

        return res
        .status(201).json({message: "module created successfully", data: newModule})

    } catch (error) {
        return res
        .status(500)
        .json({message: "error creating module", error: error.message})
    }
}

export const addLessonToModule = async (req, res) => {
    try {
        const {moduleId} = req.params;
        const {title, overview, duration, order} = req.body;

        
        const module = await Module.findById(moduleId);
        if (!module) {
            return res
            .status(404).json({message: "module not found"})
        };

        if(!req.file) {
            return res.status(400).json({message: "Lesson video is required"})
        }

        const uploadResult = await uploadToCloudinary(req.file.buffer);

        const createdLesson = await Lesson.create({
            moduleId,
            title,
            overview,
            duration,
            order,
            videoUrl: uploadResult.secure_url,
            videoPublicId: uploadResult.public_id
        })

        return res
        .status(201)
        .json({message: "lesson created successfully", data: createdLesson})

    } catch (error) {
        return res
        .status(500)
        .json({message: "error creating lesson", error: error.message})
    }
}

export const getModuleWithLessons = async (req, res) => {
    try {
        const {moduleId} = req.params
        const module = await Module.findById(moduleId);
        if (!module) {
            return res
            .status(404).json({message: "module not found"})
        }
        const moduleLessons = await Lesson.find({moduleId: moduleId}).sort({order: 1 })
        return res
        .status(200).json({message: "Lessons fetched successfully", data: {module, moduleLessons, totalLessons: moduleLessons.length}})
    } catch (error) {
        return res
        .status(500).json({message: "error fetching Lessons", error: error.message})
    }
}

// get all module
export const getAllModule = async (req, res) => {
    try {
        const Modules = await Module.find();

        return res
        .status(200)
        .json({message: "modules fetched successfully", data: Modules})
    } catch (error) {
        return res
        .status(500)
        .json({message: "error fetching modules", error: error.message})
    }
}

// get Module by Id
export const getModuleById = async (req, res) => {
    try {
        const {id} = req.params;
        const requestedModule = await Module.findById(id);
        if (!requestedModule) {
            return res
            .status(404).json({message: "module not found"})
        }

        return res
        .status(200)
        .json({message: "module fetched successfully", data: requestedModule})
    } catch (error) {
        return res
        .status(500)
        .json({message: "error fetching module", error: error.message})
    }
}

// update Module
export const updateModule = async (req, res) => {
    try {
        const {id} = req.params
        const updatedModule = await Module.findByIdAndUpdate(id, req.body,{
            new: true,
            runValidators: true
        });
        if (!updatedModule) {
            return res
            .status(404).json({message: "module not found"})
        }
        
        return res
        .status(200)
        .json({message: "module updated successfully", data: updatedModule})
    } catch (error) {
        return res
        .status(500)
        .json({message: "error update module", error: error.message})
    }
}

// delete Module
export const deleteModule = async (req, res) => {
    try {
        const {id} = req.params
        const module = await Module.findById(id);
        if(!module) {
            return res
            .status(404).json({message: "module not found"});
        }
        const lessons = await Lesson.find({moduleId: id});
        for (const lesson of lessons) {
            await deleteFromCloudinary(lesson.videoPublicId);
        }
        const deletedLessons = await Lesson.deleteMany({moduleId: id});
        const deletedModule = await Module.findByIdAndDelete(id)
        return res
        .status(200)
        .json({message: "module deleted successfully", data: {deletedLessons, deletedModule}})
    } catch (error) {
        return res
        .status(500)
        .json({message: "error deleting module", error: error.message})
    }
}

// publish module
export const publishModule = async (req, res) => {
    try {
        const {id} = req.params
        const module = await Module.findByIdAndUpdate(id, {
            status: "published"}, {new: true, runValidators: true})
        if (!module) {
            return res
            .status(404).json({message: "module not found"})
        }
        return res
        .status(200).json({message: "module published successfully", data: module})
    } catch (error) {
        return res
        .status(500).json({message: "error publishing", error: error.message})
    }
}