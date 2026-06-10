import express from "express";
import { createBadge, getAllBadges, getBadgeById, updateBadge } from "../controllers/badgeController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/createBadge", authMiddleware, roleMiddleware("admin"), createBadge);
router.get("/getAllBadges", authMiddleware, getAllBadges);
router.get("/getBadgeById/:id", authMiddleware, getBadgeById);
router.patch("/updateBadge/:id", authMiddleware, roleMiddleware("admin"), updateBadge);