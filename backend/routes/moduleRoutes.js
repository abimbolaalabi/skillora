import express from "express";
const router = express.Router();
const upload = require("../middleware/uploadMiddleware.js");
const {createModule, getAllModule, getModuleById, updateModule, deleteModule, publishModule} = require("../controllers/moduleController.js");

// TODO: wire up module controller methods
router.get("/getAllModule", getAllModule);
router.get("/getModuleById/:id", getModuleById);
router.patch("/updateModule/:id", updateModule);
router.patch("/publishModule/:id", publishModule);
router.post("/createModule", upload.single("video"), createModule);
router.delete("/deleteModule/:id", deleteModule);

export default router;
