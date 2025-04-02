import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  sendConnectionRequestController,
  reviewConnectionRequestController,
} from "../controllers/connectionRequest.controller.js";

const connectionRequestRouter = express.Router();

connectionRequestRouter.post(
  "/send/:status/:toUserId",
  authenticate,
  sendConnectionRequestController
);
connectionRequestRouter.post(
  "/review/:status/:requestId",
  authenticate,
  reviewConnectionRequestController
);

export default connectionRequestRouter;
