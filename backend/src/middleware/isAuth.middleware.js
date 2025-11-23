import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" })
 
        const decoded = jwt.verify(token, process.env.SECRETKEY);
       req.user = { _id: decoded.id };
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: "Unauthorized" });
    }
};