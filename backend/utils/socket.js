import { Server } from "socket.io";
import crypto from "crypto";
import { pool } from "../config/index.js";

export let io = null; // Global socket instance

/**
 * Generate a unique secret room ID for two users
 */
const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

/**
 * Initialize Socket.IO with server
 */
const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Adjust if needed
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User joins the chat room
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
      console.log(`User ${userId} joined room: ${roomId}`);
    });

    // Handle sending a message
    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          const client = await pool.connect();

          try {
            await client.query("BEGIN");

            // Find or create chat
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
            let chatId = chats.length ? chats[0].id : null;

            if (!chatId) {
              // Create new chat
              const newChatResult = await client.query(
                "INSERT INTO chats DEFAULT VALUES RETURNING id"
              );
              chatId = newChatResult.rows[0].id;

              // Add participants
              await client.query(
                "INSERT INTO chat_participants (chat_id, user_id) VALUES ($1, $2), ($1, $3)",
                [chatId, userId, targetUserId]
              );
            }

            // Insert new message
            const messageInsertQuery = `
              INSERT INTO messages (chat_id, sender_id, text) 
              VALUES ($1, $2, $3) 
              RETURNING id, created_at;
            `;
            const { rows: insertedMessage } = await client.query(
              messageInsertQuery,
              [chatId, userId, text]
            );
            const messageId = insertedMessage[0].id;
            const createdAt = insertedMessage[0].created_at;

            await client.query("COMMIT");

            // Emit message to the room (both users)
            io.to(roomId).emit("messageReceived", {
              messageId,
              firstName,
              lastName,
              userId,
              text,
              createdAt,
            });
          } catch (err) {
            await client.query("ROLLBACK");
            console.error("Message saving failed:", err);
          } finally {
            client.release();
          }
        } catch (err) {
          console.error("Database connection error:", err);
        }
      }
    );

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default initializeSocket;
