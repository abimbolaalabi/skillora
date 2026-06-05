import express, { Router } from "express";
import { getUsers, getUserById, updateUser, deleteUser, getDepartments } from "../controllers/userController.js";
const router = express.Router();

router.get("/getUsers", getUsers);
router.get("/getUserById/:id", getUserById);
router.patch("/updateUser/:id", updateUser);
router.delete("/deleteUser/:id", deleteUser);
router.get("/getDepartments", getDepartments);

// TODO: wire up user controller methods

export default router;
