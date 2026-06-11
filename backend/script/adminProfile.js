import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Department from '../models/Department.js';

import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();
connectDB();

const createAdmin = async () => {
    try {
        await connectDB();
        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
        let adminDepartment = await Department.findOne({name: "Administration"});
        if (!adminDepartment) {
            adminDepartment = await Department.create({name: "Administration", description: "System Administration"})
            console.log("Admin department created");
        }
        if (existingAdmin) {
            console.log('Admin already exists');
            return;
        };
        
           

        const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        const admin = new User({
            name: 'Admin',
            email: process.env.ADMIN_EMAIL || 'admin@example.com',
            password: adminPassword || 'admin123',
            role: 'admin',
            department: adminDepartment._id
        });

        await Department.findByIdAndUpdate(adminDepartment._id, {
            $addToSet: {
                members: admin._id
            }
        })

        await admin.save();
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        process.exit();
    }
};

createAdmin();