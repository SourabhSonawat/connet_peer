import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getReceivedRequestsController,
  getUserConnectionsController,
  getUserFeedController,
} from "../controllers/connectionRequest.controller.js";

const userRouter = express.Router();

userRouter.get(
  "/requests/received",
  authenticate,
  getReceivedRequestsController
);
userRouter.get("/connections", authenticate, getUserConnectionsController);
userRouter.get("/feed", authenticate, getUserFeedController);

export default userRouter;
