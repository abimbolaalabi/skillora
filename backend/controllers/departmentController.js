import Department from "../models/Department.js";

export const createDepartment = async (req, res) => {
    try {
        const {name, description, supervisor} = req.body
        const department = await Department.create({name, description, supervisor})
        return res
        .status(201).json({message: "department created successfully", data: department})
    } catch (error) {
        return res
        .status(500).json({message: "error updating department", error: error.message});
    }
}

export const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find()
        if (departments.length === 0) {
            return res
            .status(400).json({message: "no department yet"})
        }
        return res
        .status(200).json({message: "departments fetched successfully", data: departments})
    } catch (error) {
        return res
        .status(500).json({message: "error fetching department", error: error.message});
    }
}

export const getDepartmentById = async (req, res) => {
    try {
        const {id} = req.params;
        const department = await Department.findByIdAndUpdate(id)
        if (!department) {
            return res
            .status(404).json({message: "department not found"})
    }

    return res.status(200).json({message: "department fetched successfully", data: department})
}  catch (error) {
        return res
        .status(500).json({message: "error updating notification", error: error.message});
    }
} 



export const updateDepartment = async (req, res) => {
    try {
        const {id} = req.params
        const {name, description, supervisor} = req.body
        const department = await Department.findByIdAndUpdate(id, {name: name, description: description, supervisor: supervisor}, {new: true, runValidators: true})

        if (!department) {
            return res
            .status(404).json({message: "department not found"})
        }
        return res
        .status(200).json({message: "department updated successfully", data: department})
    } catch (error) {
        return res
        .status(500).json({message: "error updating notification", error: error.message});
    }
}

export const deleteDepartment = async (req, res) => {
    try {
        const {id} = req.params
        const department = await Department.findByIdAndDelete(id);
        if (!department) {
            return res
            .status(404).json({message: "department not found"})
        }
        return res
        .status(200).json({message: "department deleted successfully", data: department})

    } catch (error) {
        return res
        .status(500).json({message: "error updating notification", error: error.message});
    }
}