import express from "express";
import {createDepartment, updateDepartment, deleteDepartment, getDepartments, getDepartmentById} from "../controllers/departmentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const Router = express.Router();

Router.get("/getDepartments", getDepartments);

Router.patch("/updateDepartment/:id", authMiddleware, roleMiddleware("admin"), updateDepartment);

Router.post("/createDepartment", authMiddleware, roleMiddleware("admin"), createDepartment);

Router.delete("/deleteDepartment/:id", authMiddleware, roleMiddleware("admin"), deleteDepartment);
Router.get("/getDepartmentById/:id", authMiddleware, roleMiddleware("admin"), getDepartmentById)

export default Router;