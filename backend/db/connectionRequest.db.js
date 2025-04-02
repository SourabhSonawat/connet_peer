import { pool } from "../config/index.js";

export const getReceivedRequests = async (userId) => {
  const query = `
    SELECT cr.id AS request_id, cr.status, cr.created_at,
           u.id , u.first_name, u.last_name, u.age, u.skills, u.about, u.photo_url, u.gender
    FROM connection_requests cr
    JOIN users u ON cr.from_user_id = u.id
    WHERE cr.to_user_id = $1 AND cr.status = 'interested'
    ORDER BY cr.created_at DESC;
  `;
  const { rows } = await pool.query(query, [userId]);
  console.log(rows);
  return rows;
};

// Get all connections for a user
export const getUserConnections = async (userId) => {
  const query = `
    SELECT u.id, u.first_name, u.last_name, u.age, u.skills, u.about, u.photo_url, u.gender
    FROM connection_requests cr
    JOIN users u ON (cr.from_user_id = u.id OR cr.to_user_id = u.id)
    WHERE (cr.from_user_id = $1 OR cr.to_user_id = $1) AND cr.status = 'accepted'
    AND u.id <> $1
    ORDER BY cr.created_at DESC;
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

// Get users for feed (excluding connections)
export const getUserFeed = async (userId, limit, offset) => {
  const query = `
    SELECT u.id, u.first_name, u.last_name, u.age, u.skills, u.about, u.photo_url, u.gender
    FROM users u
    WHERE u.id <> $1 
      AND NOT EXISTS (
        SELECT 1 FROM connection_requests cr
        WHERE (cr.from_user_id = u.id AND cr.to_user_id = $1)
           OR (cr.to_user_id = u.id AND cr.from_user_id = $1)
      )
    ORDER BY u.created_at DESC
    LIMIT $2 OFFSET $3;
  `;
  const { rows } = await pool.query(query, [userId, limit, offset]);
  return rows;
};

// Check if a user exists
export const findUserById = async (userId) => {
  const query = `SELECT id FROM users WHERE id = $1;`;
  const { rows } = await pool.query(query, [userId]);
  return rows[0];
};

// Check if a connection request already exists
export const findExistingRequest = async (fromUserId, toUserId) => {
  const query = `
    SELECT * FROM connection_requests
    WHERE (from_user_id = $1 AND to_user_id = $2)
       OR (from_user_id = $2 AND to_user_id = $1);
  `;
  const { rows } = await pool.query(query, [fromUserId, toUserId]);
  return rows[0];
};

// Create a new connection request
export const createConnectionRequest = async (fromUserId, toUserId, status) => {
  const query = `
    INSERT INTO connection_requests (from_user_id, to_user_id, status)
    VALUES ($1, $2, $3) RETURNING *;
  `;
  const { rows } = await pool.query(query, [fromUserId, toUserId, status]);
  return rows[0];
};

// Update connection request status
export const updateConnectionRequestStatus = async (
  loggedInUserId,
  requestId,
  status
) => {
  console.log("Logged In User ID:", loggedInUserId); // Log the loggedInUserId
  console.log("Request ID:", requestId); // Log the requestId
  console.log("Status:", status); // Log the status

  const query = `
    UPDATE connection_requests
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2 AND to_user_id = $3 AND status = 'interested'
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [status, requestId, loggedInUserId]);
  // Log the rows to see if the update was successful
  console.log("Updated Rows:", rows);
  if (!rows.length) throw new Error("Connection request not found");
  return rows[0];
};
