import express from "express";
import uploadImage from "../middleware/uploadImage.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
createBadge,
getAllBadges,
getBadgeById,
updateBadge,
deleteBadge
} from "../controllers/badgeController.js";

const router = express.Router();

//Public Routes

router.get("/", getAllBadges);
router.get("/:id", getBadgeById);


// Admin Routes

router.post("/",
    authMiddleware, 
    roleMiddleware("admin"), 
    uploadImage.single("icon"), 
    createBadge);

router.patch("/:id", 
    authMiddleware, 
    roleMiddleware("admin"), 
    uploadImage.single("file"), 
    updateBadge);

router.delete("/:id", 
    authMiddleware, 
    roleMiddleware("admin"), 
    deleteBadge);

export default router;
