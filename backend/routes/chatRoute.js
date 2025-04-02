// import express from "express";
// import { authenticate } from "../middleware/auth.middleware.js";
// import { pool } from "../config/index.js";

// const chatRouter = express.Router();

// chatRouter.get("/chat/:targetUserId", authenticate, async (req, res) => {
//   const { targetUserId } = req.params;
//   const userId = req.user.id; // Authenticated user ID

//   if (!targetUserId || userId === parseInt(targetUserId)) {
//     return res.status(400).json({ message: "Invalid target user ID." });
//   }

//   const client = await pool.connect();

//   try {
//     await client.query("BEGIN");

//     // Check if a chat already exists between the users
//     const chatQuery = `
//       SELECT c.id
//       FROM chats c
//       JOIN chat_participants p1 ON c.id = p1.chat_id
//       JOIN chat_participants p2 ON c.id = p2.chat_id
//       WHERE p1.user_id = $1 AND p2.user_id = $2
//       LIMIT 1;
//     `;

//     const { rows: chats } = await client.query(chatQuery, [
//       userId,
//       targetUserId,
//     ]);
//     let chatId;

//     if (chats.length === 0) {
//       // No chat found, create a new chat
//       const newChatResult = await client.query(
//         "INSERT INTO chats DEFAULT VALUES RETURNING id"
//       );
//       chatId = newChatResult.rows[0].id;

//       // Insert participants into the chat
//       await client.query(
//         "INSERT INTO chat_participants (chat_id, user_id) VALUES ($1, $2), ($1, $3)",
//         [chatId, userId, targetUserId]
//       );
//     } else {
//       chatId = chats[0].id;
//     }

//     // Fetch chat messages with sender details
//     const chatWithMessagesQuery = `
//       SELECT
//         c.id,
//         c.created_at,
//         COALESCE(
//           json_agg(
//             json_build_object(
//               'id', m.id,
//               'text', m.text,
//               'created_at', m.created_at,
//               'sender', CASE WHEN u.id IS NOT NULL THEN json_build_object(
//                 'id', u.id,
//                 'firstName', u.first_name,
//                 'lastName', u.last_name
//               ) ELSE NULL END
//             ) ORDER BY m.created_at
//           ) FILTER (WHERE m.id IS NOT NULL), '[]'::json
//         ) AS messages
//       FROM chats c
//       LEFT JOIN messages m ON c.id = m.chat_id
//       LEFT JOIN users u ON m.sender_id = u.id
//       WHERE c.id = $1
//       GROUP BY c.id;
//     `;

//     const { rows } = await client.query(chatWithMessagesQuery, [chatId]);
//     const chat = rows[0];

//     const formattedChat = {
//       id: chat.id,
//       participants: [userId, targetUserId],
//       messages: chat.messages || [],
//       createdAt: chat.created_at,
//     };

//     await client.query("COMMIT");
//     res.json(formattedChat);
//   } catch (err) {
//     await client.query("ROLLBACK");
//     console.error("Error fetching chat:", err);
//     res.status(500).json({ message: "Internal server error." });
//   } finally {
//     client.release();
//   }
// });

// export default chatRouter;

import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { pool } from "../config/index.js";
// import { io } from "../socket/index.js"; // Import the socket instance

const chatRouter = express.Router();

// Get or Create a Chat & Fetch Messages
chatRouter.get("/chat/:targetUserId", authenticate, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user.id;

  if (!targetUserId || userId === parseInt(targetUserId)) {
    return res.status(400).json({ message: "Invalid target user ID." });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Find or create a chat
    const chatQuery = `
      SELECT c.id FROM chats c
      JOIN chat_participants p1 ON c.id = p1.chat_id
      JOIN chat_participants p2 ON c.id = p2.chat_id
      WHERE p1.user_id = $1 AND p2.user_id = $2
      LIMIT 1;
    `;

    const { rows: chats } = await client.query(chatQuery, [
      userId,
      targetUserId,
    ]);
    let chatId;

    if (chats.length === 0) {
      // Create new chat if not found
      const newChatResult = await client.query(
        "INSERT INTO chats DEFAULT VALUES RETURNING id"
      );
      chatId = newChatResult.rows[0].id;

      // Add participants
      await client.query(
        "INSERT INTO chat_participants (chat_id, user_id) VALUES ($1, $2), ($1, $3)",
        [chatId, userId, targetUserId]
      );
    } else {
      chatId = chats[0].id;
    }

    // Fetch chat messages
    const chatWithMessagesQuery = `
      SELECT 
        c.id, 
        c.created_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', m.id,
              'text', m.text,
              'created_at', m.created_at,
              'sender', json_build_object(
                'id', u.id,
                'firstName', u.first_name,
                'lastName', u.last_name
              )
            ) ORDER BY m.created_at
          ) FILTER (WHERE m.id IS NOT NULL), '[]'::json
        ) AS messages
      FROM chats c
      LEFT JOIN messages m ON c.id = m.chat_id
      LEFT JOIN users u ON m.sender_id = u.id
      WHERE c.id = $1
      GROUP BY c.id;
    `;

    const { rows } = await client.query(chatWithMessagesQuery, [chatId]);
    const chat = rows[0];

    const formattedChat = {
      id: chat.id,
      participants: [userId, targetUserId],
      messages: chat.messages || [],
      createdAt: chat.created_at,
    };

    await client.query("COMMIT");
    res.json(formattedChat);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error fetching chat:", err);
    res.status(500).json({ message: "Internal server error." });
  } finally {
    client.release();
  }
});

export default chatRouter;
