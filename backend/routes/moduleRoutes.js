import express from "express";
const router = express.Router();
import upload from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/authMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";
import {createModule, getAllModule, getModuleById, updateModule, deleteModule, publishModule} from "../controllers/moduleController.js";

// TODO: wire up module controller methods
router.get("/getAllModule", getAllModule);
router.get("/getModuleById/:id", getModuleById);
router.patch("/updateModule/:id", authMiddleware, roleMiddleware("Admin") updateModule);
router.patch("/publishModule/:id", publishModule);
router.post("/createModule", authMiddleware, roleMiddleware("Admin") upload.single("video"), createModule);
router.delete("/deleteModule/:id", deleteModule);

export default router;
