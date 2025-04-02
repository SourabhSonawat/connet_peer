// // // import express from "express";
// // // import authRouter from "./routes/authRoute.js";
// // // import cookieParser from "cookie-parser";
// // // import profileRouter from "./routes/profileRoute.js";
// // // import userRouter from "./routes/userRoutes.js";
// // // import connectionRequestRouter from "./routes/requestRoutes.js";
// // // import cors from "cors";

// // // const app = express();

// // // // Use middlewares
// // // app.use(express.json());
// // // app.use(cookieParser());
// // // app.use(
// // //   cors({
// // //     origin: "http://localhost:5173", // Update this if your frontend is on a different port
// // //     methods: "GET,POST,PATCH,DELETE",
// // //     allowedHeaders: "Content-Type, Authorization",
// // //     credentials: true,
// // //   })
// // // );

// // // // Use routes
// // // app.use("/auth", authRouter);
// // // app.use("/profile", profileRouter);
// // // app.use("/user", userRouter);
// // // app.use("/request", connectionRequestRouter);

// // // export default app;

// // import express from "express";
// // import authRouter from "./routes/authRoute.js";
// // import cookieParser from "cookie-parser";
// // import profileRouter from "./routes/profileRoute.js";
// // import userRouter from "./routes/userRoutes.js";
// // import connectionRequestRouter from "./routes/requestRoutes.js";
// // import chatRouter from "./routes/chatRoute.js"; // Import the chat routes
// // import cors from "cors";

// // const app = express();

// // // Use middlewares
// // app.use(express.json());
// // app.use(cookieParser());
// // app.use(
// //   cors({
// //     origin: "http://localhost:5173", // Update this if your frontend is on a different port
// //     methods: "GET,POST,PATCH,DELETE",
// //     allowedHeaders: "Content-Type, Authorization",
// //     credentials: true,
// //   })
// // );

// // // Use routes
// // app.use("/auth", authRouter);
// // app.use("/profile", profileRouter);
// // app.use("/user", userRouter);
// // app.use("/request", connectionRequestRouter);
// // app.use("/api", chatRouter); // Add the chat router

// // export default app;

// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import authRouter from "./routes/authRoute.js";
// import profileRouter from "./routes/profileRoute.js";
// import userRouter from "./routes/userRoutes.js";
// import connectionRequestRouter from "./routes/requestRoutes.js";
// import chatRouter from "./routes/chatRoute.js";

// const app = express();

// // Middlewares
// app.use(express.json());
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Update if frontend is deployed elsewhere
//     methods: "GET,POST,PATCH,DELETE",
//     allowedHeaders: "Content-Type, Authorization",
//     credentials: true,
//   })
// );

// // Routes
// app.use("/auth", authRouter);
// app.use("/profile", profileRouter);
// app.use("/user", userRouter);
// app.use("/request", connectionRequestRouter);
// app.use("/api", chatRouter); // Chat routes

// export default app;
