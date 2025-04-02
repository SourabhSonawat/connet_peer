import AuthService from "../services/auth.service.js";
import { ErrorHandler } from "../helpers/error.js";

export const SignUp = async (req, res) => {
  try {
    const { first_name, last_name, email_id, password } = req.body;

    const existingUser = await AuthService.getUserByEmail(email_id);
    if (existingUser) {
      throw new ErrorHandler(400, "User already exists with this email.");
    }

    const newUser = await AuthService.createUser({
      first_name,
      last_name,
      email_id,
      password,
    });

    console.log(newUser);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// Login Controller
export const Login = async (req, res) => {
  try {
    const { email_id, password } = req.body;

    const user = await AuthService.getUserByEmail(email_id);
    if (!user) {
      throw new ErrorHandler(404, "User not found.");
    }

    const isMatch = await AuthService.verifyPassword(password, user.password);
    if (!isMatch) {
      throw new ErrorHandler(401, "Invalid credentials.");
    }

    const token = await AuthService.generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// Logout Controller
export const Logout = (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
