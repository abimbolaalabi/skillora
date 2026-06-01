// TODO: register, login, getMe
import User from "../models/User.js";
import hashPassword from "../utils/hashPassword.js";

const register = async (req, res) => {
    try {
        const { name, email, password, role, department } = req.body;
        const existingMail = await User.findOne({email});
        
        if(existingMail){
            return res.status(400).json({
                error: "Email already used"
            });
        };
    
        const hashPassword = await hashPassword(password);
        const createUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            department
        });
        res.status(201).json({
            message: "User created successfully",
            user: createUser
        }); 
    }
    catch (error) {
        res.status(500).json({
            error: "Server error"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const mail = await User.findOne({email});

        if(!mail){
            return res.status(400).json({
                error: "Incorrect email"
            });
        }

        // Compare passwords (assuming you have a method to do this)
        const isMatch = await mail.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({
                error: "Incorrect email or password"
            });
        }

        // Generate JWT token
        const token = await mail.generateAuthToken();

        res.status(200).json({
            message: "Login successful",
            token,
            mail
        });
    } catch (error) {
        res.status(500).json({
            error: "Server error"
        });
    }
};

export default { register, login };