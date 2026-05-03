const express = require("express");
const authMiddleware = require("../middleware/authentication");
const { updateUser, getUser } = require("../controllers/userController");

const router = express.Router();

router.patch("/updateUser", authMiddleware, updateUser);
router.get("/bulk", authMiddleware, getUser);

module.exports = router;
