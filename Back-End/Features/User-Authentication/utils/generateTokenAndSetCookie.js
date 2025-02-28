import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, userId) => {
  const Token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });


  res.cookie("AuthenticationToken", Token, {
    httpOnly: true, // to prevent XSS attacks
    secure: process.env.NODE_ENV === "production", // to only allow https
    sameSite: "strict",
    maxAge: 14 * 24* 60 * 60 * 1000, // 14 days
  });

  return Token;
}
