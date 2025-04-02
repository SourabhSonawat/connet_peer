import { getUserByIdDb, updateUserProfileDb } from "../db/profile.db.js";
import { ErrorHandler } from "../helpers/error.js";

// Profile Service
class ProfileService {
  // Get Profile by User ID
  async getProfile(userId) {
    try {
      const user = await getUserByIdDb(userId);
      if (!user) {
        throw new ErrorHandler(404, "User not found.");
      }
      return user;
    } catch (error) {
      throw new ErrorHandler(500, "Error retrieving user profile.");
    }
  }

  // Update Profile
  async updateProfile(userId, updatedData) {
    try {
      const updatedUser = await updateUserProfileDb(userId, updatedData);
      if (!updatedUser) {
        throw new ErrorHandler(404, "User not found.");
      }
      return updatedUser;
    } catch (error) {
      throw new ErrorHandler(500, "Error updating user profile.");
    }
  }
}

export default new ProfileService();
