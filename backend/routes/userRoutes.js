import express from "express";
const router = express.Router();

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getDepartments
} from "../controllers/userController.js";

router.post(
    "/createUser", 
    authMiddleware, 
    roleMiddleware("admin"), 
    createUser);

router.get(
    "/getUsers", 
    authMiddleware, 
    roleMiddleware("admin"), 
    getUsers);

    
router.get(
    "/getUserById/:id", 
    authMiddleware, 
    getUserById); 

router.put(
    "/updateUser/:id", 
    authMiddleware, 
    updateUser);
router.delete(
    "/deleteUser/:id", 
    authMiddleware, 
    roleMiddleware("admin"),
    deleteUser);

router.get(
    "/getDepartments", 
    authMiddleware, 
    roleMiddleware("admin", "manager"), 
    getDepartments);

export default router;
