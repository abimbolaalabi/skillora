import Badge from "../models/Badge.js";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
    {
        folder: "badges",
    },
        (error, result) => {
            if (error) return reject(error);
                resolve(result);
        }
    );

   stream.end(buffer);


    });
};


  export const createBadge = async (req, res) => {
  try {
  const { name, description, criteria, category, score } = req.body;

   if (!req.file) {
       return res.status(400).json({
           success: false,
           message: "Badge icon is required",
       });
   }

   const uploadResult = await uploadToCloudinary(req.file.buffer);

   const badge = await Badge.create({
       name,
       description,
       criteria,
       category,
       score: "score" in req.body ? (score === "" ? null : score) : null,
       iconUrl: uploadResult.secure_url,
   });

   return res.status(201).json({
       success: true,
       message: "Badge created successfully",
       data: badge,
   });


  } catch (error) {
        return res.status(400).json({
        success: false,
        message: error.message,
        });
    }
};


export const getAllBadges = async (req, res) => {
    try {
    const badges = await Badge.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: badges.length,
            data: badges,
    });


  } catch (error) {
    return res.status(500).json({
        sccess: false,
        message: error.message,
        });
    }
};


export const getBadgeById = async (req, res) => {
    try {
        const badge = await Badge.findById(req.params.id);


        if (!badge) {
            return res.status(404).json({
                success: false,
                message: "Badge not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: badge,
   });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


    export const updateBadge = async (req, res) => {
        try {
            const {
                name,
                description,
                criteria,
                category,
                score,
                isActive,
                } = req.body;

           const badge = await Badge.findById(req.params.id);

           if (!badge) {
                return res.status(404).json({
                    success: false,
                    message: "Badge not found",
                });
            }

            if (name !== undefined) badge.name = name;
            if (description !== undefined) badge.description = description;
            if (criteria !== undefined) badge.criteria = criteria;
            if (category !== undefined) badge.category = category;
            if (isActive !== undefined) badge.isActive = isActive;

            if ("score" in req.body) {
                badge.score = score === "" ? null : score;
            }

            if (req.file) {
                const uploadResult = await uploadToCloudinary(req.file.buffer);
                badge.iconUrl = uploadResult.secure_url;
            }

        const updatedBadge = await badge.save();

        return res.status(200).json({
            success: true,
            message: "Badge updated successfully",
            data: updatedBadge,
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteBadge = async (req, res) => {
    try {
        const badge = await Badge.findByIdAndDelete(req.params.id);

        if (!badge) {
            return res.status(404).json({
                success: false,
                message: "Badge not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Badge deleted successfully",
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

