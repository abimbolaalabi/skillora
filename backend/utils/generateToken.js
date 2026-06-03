import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user._id, // include user ID in token payload
            role: user.role //include user role in token payload
         },
        process.env.JWT_SECRET, 
        { expiresIn: '12h' }
    );
};

export default generateToken;