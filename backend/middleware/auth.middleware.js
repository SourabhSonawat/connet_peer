import jwt from "jsonwebtoken";
import { getUserByEmailDb } from "../db/auth.db.js";

export const authenticate = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await getUserByEmailDb(decoded.email);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    req.user = {
      id: user.id,
      email: user.email_id,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    next();
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired token." });
  }
};
