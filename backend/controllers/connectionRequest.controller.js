import connectionRequestService from "../services/connectionRequest.service.js";

export const getReceivedRequestsController = async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests =
      await connectionRequestService.getReceivedRequests(loggedInUser.id);
    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserConnectionsController = async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    const connections = await connectionRequestService.getUserConnections(
      loggedInUser.id
    );
    res.json({ message: "Fetched successfully", data: connections });
  } catch (err) {
    next(err);
  }
};

export const getUserFeedController = async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    const { page = 1, limit = 10 } = req.query;
    const users = await connectionRequestService.getUserFeed(
      loggedInUser.id,
      parseInt(page),
      parseInt(limit)
    );
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
};

export const sendConnectionRequestController = async (req, res, next) => {
  try {
    const { status, toUserId } = req.params;
    const loggedInUser = req.user;

    console.log(loggedInUser);
    const data = await connectionRequestService.sendConnectionRequest(
      loggedInUser.id,

      toUserId,
      status
    );

    console.log(data);
    res.json({
      message: `${loggedInUser.first_name} is ${status} in ${toUserId}`,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const reviewConnectionRequestController = async (req, res, next) => {
  try {
    const { status, requestId } = req.params;
    const loggedInUser = req.user;

    const data = await connectionRequestService.reviewConnectionRequest(
      loggedInUser.id,
      requestId,
      status
    );

    res.json({ message: `Connection request ${status}`, data });
  } catch (err) {
    next(err);
  }
};
