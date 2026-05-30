import bcrypt from 'bcryptjs';


const comparedPassword = async( hashPassword, password) => {
    return await bcrypt.compare( hashPassword, password);
};

export default comparedPassword;