const express = require("express");
const { post } = require("./UserRoutes");
const router = express.Router();
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../Controllers/chatControllers");
const { protect } = require("../Middleware/authMiddleware");

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);

router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupadd").put(protect, addToGroup);
router.route("/groupremove").put(protect, removeFromGroup);

module.exports = router;
