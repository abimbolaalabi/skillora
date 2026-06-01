import express from "express";
const router = express.Router();

import { register, login } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";



router.post("/register", authMiddleware, roleMiddleware("admin"), register);
router.post("/login",authMiddleware, login);


export default router;
