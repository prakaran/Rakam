const express = require("express");
const authMiddleware = require("../middleware/authentication");
const { updateUser, getUser } = require("../controllers/userController");

const router = express.Router();

router.patch("/me", authMiddleware, updateUser);
router.get("/me", authMiddleware, getMe);
router.get("/", authMiddleware, getUser);

module.exports = router;
