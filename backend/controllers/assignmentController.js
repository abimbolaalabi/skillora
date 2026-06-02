const Assignment = require("../models/Assignment.js");
const User = require("../models/User.js");
const Notification = require("../models/Notification.js")


// TODO: createAssignment, getAssignments, getMyAssignments
// New Assignment
exports.createAssignment = async (req, res) => {
    try {
        const {moduleId, assignedTo, dueDate, department} = req.body
        if (!assignedTo && !department) {
            return res.status(401).json({message: "Assign to a user or department"})
        }

        const assignments = []

        if (assignedTo) {
            const assignment = await Assignment.create({
                moduleId,
                assignedTo,
                assignedBy: req.body._id,
                dueDate
            })

            await Notification.create({
                userId: assignedTo,
                message: "A new learning module has been assigned to you."
            });
            assignments.push(assignment);
        }
        if (department) {
            const users = User.find({department, role: "employee", isActive: true})
            for (const user of users) {
                const assignment = await Assignment.create({
                    moduleId,
                    assignedTo: user._id,
                    department,
                    assignedBy: req.user._id,
                    dueDate
                })
                await Notification.create({userId: user._id, message: "A new learning module has been assigned to your department."});
                assignments.push(assignment)
            }
        }
        return res
        .status(201)
        .json({message: "module created successfully", data: assignments})
    } catch (error) {
        return res
        .status(500)
        .json({message: "error assigning", error: error.message})
    }
}

// Get Assignments
exports.getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find()
        .populate("moduleId", "title, status")
        .populate("assignedTo", "name, email")
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
exports.getMyAssignedModules = async (req, res) => {
    try {
        const assignedModules = await Assignment.find(req.user.id)
            .populate("moduleId", "title status")
            .populate("assignedTo", "name email")
            .populate("department", "name")
            .populate("assignedBy", "name email")

            if (!assignedModules) {
                res.status(401)
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