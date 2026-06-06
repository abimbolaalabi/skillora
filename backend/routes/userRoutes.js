import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

// use auth/register & auth/login routes from authRoutes.js
//to create users and login


const router = express.Router();


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
