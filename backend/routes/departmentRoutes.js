import express from "express";
import {createDepartment, updateDepartment, deleteDepartment, getDepartments, getDepartmentById} from "../controllers/departmentController.js"

const Router = express.Router();

Router.get("/getDepartments", getDepartments);
Router.patch("/updateDepartment/:id", updateDepartment);
Router.post("/createDepartment", createDepartment);
Router.delete("/deleteDepartment/:id", deleteDepartment);
Router.get("/getDepartmentById/:id", getDepartmentById)

export default Router