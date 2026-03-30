const express = require("express");
const { registerUser } = require("../Controllers/userControllers");
const { authUser } = require("../Controllers/userControllers");
const { allUsers } = require("../Controllers/userControllers");
const { protect } = require("../Middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);

module.exports = router;
