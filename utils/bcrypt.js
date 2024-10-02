import bcrypt from "bcryptjs";

const saltRounds = 10;

export const hashPassword =  async (password) => {
    return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};