import jwt from "jsonwebtoken";

export const createToken = (userId) => {
 
    const token = jwt.sign(
        {
            userId
        },
        process.env.JWT_KEY,{ 
        expiresIn: '2h',
});
    return token
    


};


export const CheckToken = (token) => {
    try {
        const Parsed = jwt.verify(token, process.env.JWT_KEY);
        return Parsed
    } catch (error) {
        console.log('Token is not valid');
throw new Error('Token is not valid');        
    }
};