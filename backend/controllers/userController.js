// TODO: getUsers, getUserById, updateUser, deleteUser, getDepartments
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const createUser = async(req, res) => {
    try{
        //to create a user, we need to check if the email already exists
        const {name, email, password, role, department} = req.body;

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({
                error: "email already used"
            });
        }
        //hash the password before saving to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            department
        });

        await user.save();
        res.status(201).json({
            message: "User created successfully",
            user
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            message: "Users retrieved successfully",
            users
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
};


const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }
        res.status(200).json({
            message: "User retrieved successfully",
            user
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
};


const updateUser = async (req, res) => {
    try {
        if (req.user.role !== "admin" ) {
            return res.status(403).json({
                error: "Access denied. Only admins can update user profiles."
            });
        }
        const allowedUpdates = {
            name: req.body.name,
            email: req.body.email,
            department: req.body.department,
            isActive: req.body.isActive
        };

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: allowedUpdates },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }
        res.status(200).json({
            message: "User updated successfully",
            user
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
};


const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }
        res.status(200).json({
            message: "User deleted successfully",
            user
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
};


const getDepartments = async (req, res) => {
    try {
        const departments = await User.distinct("department", {});
        res.status(200).json({
            message: "Departments retrieved successfully",
            departments
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
};


export { createUser, getUsers, getUserById, updateUser, deleteUser, getDepartments };