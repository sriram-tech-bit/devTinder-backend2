let express = require("express");
const userAuth = require("../middlewares/adminauth");
let ConnectionRouter = express.Router();
let ConnectionRequestModel = require("../model/ConnectionRequest")
let User = require("../model/User")


ConnectionRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    let fromUserId = req.user._id;
    let { toUserId, status } = req.params;

    let allowedStatus = ["intrested", "ignored"]
    let isallowedStatus = allowedStatus.includes(status);
    if (!isallowedStatus) {
      return res.status(400).send("invalid status")
    }
    if (fromUserId.equals(toUserId)) {
      return res.status(400).send("you can sent request to yourSelf!!")
    }
    let user = await User.findOne({ _id: toUserId })
    if (!user) {
      return res.status(404).send("user not found")
    }

    let ExistingConnectionRequest = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId: fromUserId, toUserId: toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    })

    if (ExistingConnectionRequest) {
      return res.status(400).send("connection already exist");
    }
    let connectionRequestInstance = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status
    })
    await connectionRequestInstance.save()
  if (status === "intrested") {
      sendEmail(
        user.emailId,
        "New connection request on devTinder",
        `${req.user.firstName} is interested in connecting with you. Log in to respond.`
      );
    }
    
    res.status(201).send(` your send ${status} to other user`)
  }
  catch (err) {
    res.status(500).send(err.message)
  }
})

ConnectionRouter.post("/request/review/:status/:reqId", userAuth, async (req, res) => {
  try {
    let loggedInUser = req.user._id;
    let { status, reqId } = req.params
    let allowedStatus = ["accepted", "rejected"]
    let isallowedStatus = allowedStatus.includes(status);
    if (!isallowedStatus) {
      return res.status(400).send("status not valid")
    }
    let connectionRequests = await ConnectionRequestModel.findOne({
      _id: reqId,
      toUserId: loggedInUser,
      status: "intrested"
    })
    if (!connectionRequests) {
      return res.status(404).send("connection request not found")
    }
    connectionRequests.status = status;
    await connectionRequests.save();

    

    res.status(200).json({ message: `Request ${status}`, data: connectionRequests });
  }
  catch (err) {
    res.status(500).send(err.message)
  }
})

module.exports = ConnectionRouter; 