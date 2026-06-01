const Module = require("../models/Module.js");
const cloudinary = require("../config/cloudinary.js");
const streamifier = require("streamifier");

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

// New Module
exports.createModule = async (req, res) =>{
    try {
        const {title, description, reflectionQuestion, duration} = req.body
        let videoUrl;
        let videoPublicId;

        if (req.file) {
            const uploadResult = await uploadToCloudinary(req.file.buffer);
            videoUrl = uploadResult.secure_url
            videoPublicId = uploadResult.public_id
        }

        const newModule = await Module.create({
            title,
            description,
            videoUrl,
            videoPublicId,
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

// get all module
exports.getAllModule = async (req, res) => {
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
exports.getModuleById = async (req, res) => {
    try {
        const {id} = req.params;
        const requestedModule = await Module.findById(id);

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
exports.updateModule = async (req, res) => {
    try {
        const {id} = req.params
        const updatedModule = await Module.findByIdAndUpdate(id, req.body,{
            new: true,
            runValidators: true
        })
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
exports.deleteModule = async (req, res) => {
    try {
        const id = req.params
        const deletedModule = await Module.findByIdAndDelete(id);
        return res
        .status(200)
        .json({message: "user deleted successfully", data: deletedModule})
    } catch (error) {
        return res
        .status(500)
        .json({message: "error deleting user", error: error.message})
    }
}

// publish module
exports.publishModule = async (req, res) => {
    try {
        const {id} = req.params
        const module = Module.findByIdAndUpdate(id, {
            status: "published",
            new: true
        })
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