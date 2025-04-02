import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUserDb, getUserByEmailDb } from "../db/auth.db.js";
import { ErrorHandler } from "../helpers/error.js";

class AuthService {
  getUserByEmail = async (email) => {
    return await getUserByEmailDb(email);
  };

  createUser = async ({ first_name, last_name, email_id, password }) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await createUserDb({
        first_name,
        last_name,
        email_id,
        password: hashedPassword,
      });
      return newUser;
    } catch (error) {
      throw new ErrorHandler(500, "Error creating user");
    }
  };

  verifyPassword = async (inputPassword, storedPassword) => {
    return await bcrypt.compare(inputPassword, storedPassword);
  };

  generateToken = (user) => {
    return jwt.sign(
      { id: user.id, email: user.email_id },
      process.env.JWT_SECRET || "defaultSecret",
      { expiresIn: "1h" }
    );
  };
}

export default new AuthService();
