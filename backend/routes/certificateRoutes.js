import express from "express";
import { createCertificate, getAllCertificates, getCertificateById } from "../controllers/certificateController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/createCertificate", authMiddleware, roleMiddleware("admin", "manager"), createCertificate);
router.get("/getAllCertificates", authMiddleware, getAllCertificates);
router.get("/getCertificateById/:id", authMiddleware, getCertificateById);


export default router