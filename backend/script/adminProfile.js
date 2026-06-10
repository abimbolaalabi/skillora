import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();
connectDB();

const createAdmin = async () => {
    try {
        await connectDB();
        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });

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
            department: 'Administration'
        });

        await admin.save();
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        process.exit();
    }
};

createAdmin();