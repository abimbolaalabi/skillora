import express from "express";
const router = express.Router();

import authController from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";



router.post("/register", authMiddleware, roleMiddleware("admin"), authController.register);
router.post("/login", authMiddleware, authController.login);


export default router;
