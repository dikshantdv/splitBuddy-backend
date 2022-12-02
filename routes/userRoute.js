const express = require("express");
const userController = require("../controllers/userController");
const transactionController = require("../controllers/transactionController");
const router = express.Router();

router.route("/verifyOtp").post(userController.verifyOtp);
router.route("/createUser").post(userController.createUser);
router
  .route("/updateUser")
  .post(userController.protect, userController.updateUser);
router
  .route("/getMoneyData")
  .get(userController.protect, userController.getMoneyData);
router
  .route("/addFriend")
  .post(userController.protect, userController.AddFriend);
router
  .route("/getFriends")
  .get(userController.protect, userController.getFriends);
router
  .route("/addTransaction")
  .post(userController.protect, transactionController.addTransaction);
router
  .route("/addSplit")
  .post(userController.protect, transactionController.AddSplit);
router
  .route("/getTransactions")
  .get(userController.protect, transactionController.getTransactions);
router
  .route("/getSplits")
  .get(userController.protect, transactionController.getSplits);

router
  .route("/:keyword/getFriendSearchResult")
  .get(userController.protect, userController.getFriendSearchResult);

module.exports = router;
