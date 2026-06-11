import Badge from "../models/Badge.js";

const createBadge = async (req, res) => {
    try {
        const { name, description, criteria, category} = req.body;
        const iconUrl = req.file ? req.file.path : null;
        const newBadge = await Badge.create({
            name,
            description,
            iconUrl,
            criteria,
            category 
        });
        res.status(201).json(newBadge);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllBadges = async (req, res) => {
    try {
        const badges = await Badge.find();
        res.status(200).json(badges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
};

const getBadgeById = async (req, res) => {
    try{
        const badge = await Badge.findById(req.params.id);
        if(!badge){
            return res.status(404).json({ message: "Badge not found" });
        }
        res.status(200).json(badge);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBadge = async (req, res) => {
    try {
        const { name, description, criteria, iconUrl, category } = req.body;
        const updatedBadge = await Badge.findByIdAndUpdate(
            req.params.id,
            { name, description, criteria, category, iconUrl: req.file ? req.file.path : iconUrl },
            { new: true }
        );
        if (!updatedBadge) {
            return res.status(404).json({ message: "Badge not found" });
        }
        res.status(200).json(updatedBadge);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createBadge, getAllBadges, getBadgeById, updateBadge };