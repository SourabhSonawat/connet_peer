import ProfileService from "../services/profile.service.js";
import { ErrorHandler } from "../helpers/error.js";
import { validateEditProfileData } from "../utils/validation.js";

// View Profile Controller
export const viewProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Call service to fetch user data
    const user = await ProfileService.getProfile(userId);
    if (!user) {
      throw new ErrorHandler(404, "User not found.");
    }

    res.json(user);
  } catch (err) {
    res.status(err.statusCode || 400).json({
      success: false,
      message: err.message || "An error occurred while fetching the profile.",
    });
  }
};

// Edit Profile Controller
export const editProfile = async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new ErrorHandler(400, "Invalid Edit Request");
    }

    const userId = req.user.id;
    const updatedData = req.body;

    const updatedUser = await ProfileService.updateProfile(userId, updatedData);

    res.json({
      success: true,
      message: `${updatedUser.first_name}, your profile updated successfully`,
      data: updatedUser,
    });
  } catch (err) {
    res.status(err.statusCode || 400).json({
      success: false,
      message: err.message || "An error occurred while updating the profile.",
    });
  }
};
