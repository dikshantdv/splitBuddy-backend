const express = require("express");
const userController = require("../controllers/userController");
const transactionController = require("../controllers/transactionController");
const router = express.Router();

// router.route("/VerifyOtp").post(userController.loginUser);
// router.route("/:carId").get(carController.getOneCar);
router.route("/verifyOtp").post(userController.verifyOtp);
router.route("/updateUser").post(userController.updateUser);
router.route("/createUser").post(userController.createUser);
router.route("/addFriend").post(userController.AddFriend);
router.route("/addTransaction").post(transactionController.addTransaction);
router.route("/addSplit").post(transactionController.AddSplit);
router.route("/:friendsId/getFriends").get(userController.getFriends);
router
  .route("/:keyword/getFriendSearchResult")
  .get(userController.getFriendSearchResult);
router.route("/:id/getTransactions").get(transactionController.getTransactions);
router.route("/:id/getSplits").get(transactionController.getSplits);

// router.route("/login").post(userController.loginUser);
// router.route("/getUsers/:id").get(userController.getUsers);
// router.route("/:id/documents").get(userController.loadDocuments);

module.exports = router;
