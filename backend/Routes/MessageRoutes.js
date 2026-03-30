const express = require("express");
const { protect } = require("../Middleware/authMiddleware");
const router = express.Router();
const { sendMessage } = require("../Controllers/messageControllers");
const { allMessages } = require("../Controllers/messageControllers");

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);

module.exports = router;
