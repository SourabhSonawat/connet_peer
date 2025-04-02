import { pool } from "../config/index.js";
import { ErrorHandler } from "../helpers/error.js";

export const createUserDb = async ({
  first_name,
  last_name,
  email_id,
  password,
}) => {
  const { rows: user } = await pool.query(
    `
    INSERT INTO users(first_name,last_name,email_id,password)
    VALUES ($1,$2,$3,$4)
    returning id,first_name,last_name,email_id,password,age ,gender,photo_url,about,skills,created_at`,
    [first_name, last_name, email_id, password]
  );
  return user[0];
};
export const getUserByEmailDb = async (email_id) => {
  const { rows: user } = await pool.query(
    `SELECT * FROM users WHERE email_id = $1`,
    [email_id]
  );
  return user[0] || null;
};
// export const getUserByEmailDb = async (email_id) => {
//   const { rows: user } = await pool.query(
//     `SELECT * FROM users WHERE email_id = $1`,
//     [email_id]
//   );
//   if (!user.length) {
//     throw new ErrorHandler(404, "User not found.");
//   }
//   return user[0];
// };

// const getUserByEmail = async (email_id) => {
//   const user = await pool.query("SELECT * FROM users WHERE email_id = $1", [email_id]);
//   if (!user.rows.length) {
//     throw new ErrorHandler(404, "User not found.");
//   }
//   return user.rows[0];
// };
