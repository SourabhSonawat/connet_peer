import { pool } from "../config/index.js";

// Get User by ID
export const getUserByIdDb = async (userId) => {
  const query = `
    SELECT id, first_name, last_name, email_id, age, gender, photo_url, about, skills, created_at, updated_at
    FROM users
    WHERE id = $1;
  `;
  const result = await pool.query(query, [userId]);

  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
};

// Update User Profile
export const updateUserProfileDb = async (userId, updatedData) => {
  const {
    first_name,
    last_name,
    email_id,
    age,
    gender,
    photo_url,
    about,
    skills,
  } = updatedData;

  const query = `
    UPDATE users
    SET 
      first_name = COALESCE($1, first_name),
      last_name = COALESCE($2, last_name),
      email_id = COALESCE($3, email_id),
      age = COALESCE($4, age),
      gender = COALESCE($5, gender),
      photo_url = COALESCE($6, photo_url),
      about = COALESCE($7, about),
      skills = COALESCE($8, skills),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $9
    RETURNING id, first_name, last_name, email_id, age, gender, photo_url, about, skills, updated_at;
  `;

  const result = await pool.query(query, [
    first_name,
    last_name,
    email_id,
    age,
    gender,
    photo_url,
    about,
    skills,
    userId,
  ]);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};
