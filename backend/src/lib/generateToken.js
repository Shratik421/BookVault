import jwt from "jsonwebtoken"

export const genrateToken = (userId) => {
  console.log("user", userId);
 return jwt.sign({ id: userId }, process.env.SECRETKEY, {
   expiresIn: "1d",
 });
};