import Assignment from "../models/Assignment.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Module from "../models/Module.js"


// TODO: createAssignment, getAssignments, getMyAssignments
// New Assignment
export const createAssignment = async (req, res) => {
    try {
        const {moduleId, assignedTo, dueDate, department, role} = req.body
        if (!assignedTo && !department && !role) {
            return res.status(401).json({message: "Assign to a user, department or role"})
        }

        const module = await Module.findById(moduleId);
        

        if (!module) {
            return res
            .status(404).json({message: "module not found"});
        }

        if (module.status == "draft") {
            return res
            .status(400).json({message: "Module not yet published"});
        }

        const assignments = []

        if (assignedTo) {
            const alreadyAssigned = await Assignment.findOne({moduleId, assignedTo})

            if (alreadyAssigned) {
                return res
                .status(400).json({message: "Module already assigned to user"});
            }
            const assignment = await Assignment.create({
                moduleId,
                assignedTo,
                department,
                assignedBy: req.user._id,
                dueDate,
                role
            })

            await Notification.create({
                userId: assignedTo,
                message: "A new learning module has been assigned to you."
            });
            assignments.push(assignment);
        }
        if (department) {
            const users = await User.find({department, isActive: true})
            for (const user of users) {
                const existingAssignment = await Assignment.findOne({moduleId, assignedTo: user._id});
                if (existingAssignment) continue;
                const assignment = await Assignment.create({
                    moduleId,
                    assignedTo: user._id,
                    department,
                    assignedBy: req.user._id,
                    dueDate,
                    role
                })
                await Notification.create({userId: user._id, message: "A new learning module has been assigned to your department."});
                assignments.push(assignment)
            }
        }

        if (role) {
            const users = await User.find({role: role, isActive: true});
            for (const user of users) {
                const existingAssignment = await Assignment.findOne({moduleId, assignedTo: user._id})
                if (existingAssignment) continue;
                const assignment = await Assignment.create({
                    moduleId,
                    assignedTo: user._id,
                    assignedBy:req.user._id,
                    dueDate,
                    role
                })
                assignments.push(assignment)
                await Notification.create({
                    userId: user._id,
                    massage: "A new learning module has been assigned to your role."
                })
            }
        }
        return res
        .status(201)
        .json({message: "assignment created successfully", data: assignments})
    } catch (error) {
        return res
        .status(500)
        .json({message: "error assigning", error: error.message})
    }
}

export const getAssignmentByRole = async (req, res) => {
    try {
        const {role} = req.params;
        const roleAssignment = await Assignment.find({role})
        return res
        .status(200).json({message: "Assignment fetched successfully", data: roleAssignment});
    } catch (error) {
        return res
        .status(500).json({message: "error fetching Assignment", error: error.message})
    }
}

// Get Assignments
export const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find()
        .populate("moduleId", "title status")
        .populate("assignedTo", "name email")
        .populate("department", "name")
        .populate("assignedBy", "name email")

        return res
        .status(200)
        .json({message: "assignments fetched successfully", data: assignments})
    } catch (error) {
        return res
        .status(500)
        .json({message: "error fetching assignments", error: error.message})
    }
}

// get user assignment
export const getMyAssignedModules = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id
        const assignedModules = await Assignment.find({assignedTo: userId})
            .populate("moduleId", "title status")
            .populate("assignedTo", "name email role")
            .populate("department", "name")
            .populate("assignedBy", "name email")

            if (assignedModules.length === 0) {
                return res
                .status(400)
                .json({message:"no module assigned to you yet"})
            }

            return res
            .status(200)
            .json({message: "module fetched successfully", data: assignedModules})

    } catch (error) {
        return res
        .status(500)
        .json({message: "error fetching assigned modules", error: error.message})
    }
}

export const deleteAssignment = async (req, res) => {
    try {
        const {id} = req.params;
        const deletedAssignment = await Assignment.findByIdAndDelete(id);
        if (!deletedAssignment) {
            return res.status(400).json({message: "assignment not found"});
        }
        return res
        .status(200)
        .json({message: "assignment deleted successfully", data: deletedAssignment})
    } catch (error) {
        return res
        .status(500).json({message: "error deleting assignment", error: error.message});
    }
}