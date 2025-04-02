// // import http from "http";
// // import dotenv from "dotenv";
// // import app from "./app.js";
// // import initializeSocket from "./utils/socket.js";
// // import path from "path";
// // import express from "express";
// // dotenv.config();

// // const server = http.createServer(app);

// // initializeSocket(server);

// // const PORT = process.env.PORT || 9002;
// // const _dirname = path.resolve();

// // server.use(express.static(path.join(_dirname, "Frontend/dist")));
// // server.get("*", (_, res) => {
// //   res.sendFile(path.resolve(_dirname, "Frontend", "dist", "index.html"));
// // });

// // server.listen(PORT, () => {
// //   console.log(`🚀 Server running on port: ${PORT}`);
// // });

// import http from "http";
// import dotenv from "dotenv";
// import app from "./app.js";
// import initializeSocket from "./utils/socket.js";
// import path from "path";
// import express from "express";
// dotenv.config();

// // Create HTTP server using the Express app
// const server = http.createServer(app);

// // Initialize Socket.io
// initializeSocket(server);

// // Set the port from environment or fallback to 9002
// const PORT = process.env.PORT || 9002;

// // Serve static files from the "Frontend/dist" folder
// const _dirname = path.resolve();

// // This serves the frontend app from the build directory
// app.use(express.static(path.join(_dirname, "Frontend", "dist")));

// // Route all unmatched requests to the frontend's index.html for SPA (Single Page Application)
// app.get("*", (_, res) => {
//   res.sendFile(path.resolve(_dirname, "Frontend", "dist", "index.html"));
// });

// // Start the server
// server.listen(PORT, () => {
//   console.log(`🚀 Server running on port: ${PORT}`);
// });
// //

import http from "http";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import initializeSocket from "./utils/socket.js";
import authRouter from "./routes/authRoute.js";
import profileRouter from "./routes/profileRoute.js";
import userRouter from "./routes/userRoutes.js";
import connectionRequestRouter from "./routes/requestRoutes.js";
import chatRouter from "./routes/chatRoute.js";

// Load environment variables
dotenv.config();

// Create an Express application
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    // origin: "http://localhost:5173", // Update this if your frontend is deployed elsewhere
    origin: "https://connet-peer.onrender.com", // Update this if your frontend is deployed elsewhere
    methods: "GET,POST,PATCH,DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

// Use routes
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/user", userRouter);
app.use("/request", connectionRequestRouter);
app.use("/api", chatRouter); // Add the chat router

// Serve static files from the "Frontend/dist" folder
const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, "frontend", "dist")));

// Route all unmatched requests to the frontend's index.html for SPA (Single Page Application)
app.get("*", (_, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

// Create HTTP server using the Express app
const server = http.createServer(app);

// Initialize Socket.io with the server
initializeSocket(server);

// Set the port from environment or fallback to 9002
const PORT = process.env.PORT || 9002;

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});
