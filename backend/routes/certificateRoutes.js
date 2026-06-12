import express from "express";
import upload from "../middleware/uploadImage.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
    createCertificate,
    getCertificates,
    getCertificateById,
    updateCertificate,
    deleteCertificate,
} from "../controllers/certificateController.js";

const router = express.Router();


router.get("/", getCertificates);
router.get("/:id", getCertificateById);

router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    upload.single("file"),
    createCertificate
);

router.patch(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    upload.single("file"),
    updateCertificate
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteCertificate
);

export default router;