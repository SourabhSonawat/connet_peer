import {
  getReceivedRequests,
  getUserConnections,
  getUserFeed,
  findUserById,
  createConnectionRequest,
  findExistingRequest,
  updateConnectionRequestStatus,
} from "../db/connectionRequest.db.js";

class ConnectionRequestService {
  async getReceivedRequests(userId) {
    return await getReceivedRequests(userId);
  }

  async getUserConnections(userId) {
    return await getUserConnections(userId);
  }

  async getUserFeed(userId, page, limit) {
    const maxLimit = 50;
    const adjustedLimit = limit > maxLimit ? maxLimit : limit;
    const offset = (page - 1) * adjustedLimit;
    return await getUserFeed(userId, adjustedLimit, offset);
  }

  async sendConnectionRequest(fromUserId, toUserId, status) {
    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      throw new Error("Invalid status type");
    }

    // Check if toUser exists
    const toUser = await findUserById(toUserId);
    if (!toUser) {
      throw new Error("User not found");
    }

    // Check if a request already exists
    const existingRequest = await findExistingRequest(fromUserId, toUserId);
    if (existingRequest) {
      throw new Error("Request already sent");
    }

    // Create a new request
    return await createConnectionRequest(fromUserId, toUserId, status);
  }

  async reviewConnectionRequest(loggedInUserId, requestId, status) {
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      throw new Error("Status not allowed");
    }

    // Update request status
    return await updateConnectionRequestStatus(
      loggedInUserId,
      requestId,
      status
    );
  }
}

export default new ConnectionRequestService();
