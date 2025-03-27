import jwt from "jsonwebtoken"

export const generateToken=(userId, res)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn:"7d"
    });

    res.cookie("jwt", token, {
        maxAge: 7*24*60*60*1000, // MS
        httpOnly: true, // prevents XSS attacks
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF protection
        secure: process.env.NODE_ENV === "production", // Secure in production
        domain: process.env.NODE_ENV === "production" ? process.env.COOKIE_DOMAIN : undefined
    });

    return token;
};
