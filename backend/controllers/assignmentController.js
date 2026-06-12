import Assignment from "../models/Assignment.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Module from "../models/Module.js"
import Department from "../models/Module.js"


// TODO: createAssignment, getAssignments, getMyAssignments
// New Assignment
export const createAssignment = async (req, res) => {
    try {
        const {moduleId, dueDate, department, role} = req.body
        const dept = Array.isArray(department) ? department : [];
        const roles = Array.isArray(role) ? role : [];
        if ((!dept || dept.length < 1) && (!roles || roles.length < 1)) {
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

        // const assignments = []

        const departmentUsers = await User.find({
            department: {$in: dept || []}    
        }).select("_id");

        const roleUsers = await User.find({
            role: {$in: roles || []}
        }).select("_id");

        const allUsers = [...departmentUsers.map(u => u._id.toString()), ...roleUsers.map(u => u._id.toString())]

        const uniqueUsers = [...new Set(allUsers)]

        const existing = await Assignment.find({
            moduleId,
            assignedTo: {$in: uniqueUsers}
        })

        const existingAssignment = new Set(
            existing.map(a => a.assignedTo.toString())
        )

        const usersToAssign = uniqueUsers.filter(id => !existingAssignment.has(id));

        if (usersToAssign.length === 0) {
            return res.status(200).json({message: "No new users to assign"})
        }

        const assignments = await Assignment.insertMany(
            usersToAssign.map((user) => ({
                moduleId,
                assignedTo: user,
                dept,
                roles,
                assignedBy: req.user._id,
                dueDate
            }))
        );

        // assignments.push(assignment);
        
        

        // if (assignedTo.length > 0) {
        //     const alreadyAssigned = await Assignment.findOne({moduleId, assignedTo})

        //     if (alreadyAssigned) {
        //         return res
        //         .status(400).json({message: "Module already assigned to user"});
        //     }
        //     const assignment = await Assignment.create({
        //         moduleId,
        //         assignedTo,
        //         department,
        //         assignedBy: req.user._id,
        //         dueDate,
        //         role
        //     })

        //     await User.findByIdAndUpdate(assignedTo, {
        //         $addToSet: {
        //             modules: moduleId
        //         }
        //     })

        //     await Notification.create({
        //         userId: assignedTo,
        //         message: "A new learning module has been assigned to you."
        //     });
        //     assignments.push(assignment);
        // }
        // if (department.length > 0) {
        //     const users = await User.find({department, isActive: true})
        //     for (const user of users) {
        //         const existingAssignment = await Assignment.findOne({moduleId, assignedTo: user._id});
        //         if (existingAssignment) continue;
        //         const assignment = await Assignment.create({
        //             moduleId,
        //             assignedTo: user._id,
        //             department,
        //             assignedBy: req.user._id,
        //             dueDate,
        //             role
        //         })
        //         await Department.findByIdAndUpdate(department, {
        //             $addToSet: {
        //                 assignedModules: moduleId
        //             }
        //         })
        //         await Notification.create({userId: user._id, message: "A new learning module has been assigned to your department."});
        //         assignments.push(assignment)
        //     }
        // }

        // if (role.length > 0) {
        //     const users = await User.find({role: role, isActive: true});
        //     for (const user of users) {
        //         const existingAssignment = await Assignment.findOne({moduleId, assignedTo: user._id})
        //         if (existingAssignment) continue;
        //         const assignment = await Assignment.create({
        //             moduleId,
        //             assignedTo: user._id,
        //             assignedBy:req.user._id,
        //             dueDate,
        //             role
        //         })
        //         assignments.push(assignment)
        //         await Notification.create({
        //             userId: user._id,
        //             massage: "A new learning module has been assigned to your role."
        //         })
        //     }
        // }
        return res
        .status(201)
        .json({message: "assignment created successfully", data: {count: assignments.length, assignments: assignments}})
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