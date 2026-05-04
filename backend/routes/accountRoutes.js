const express = require("express");
const authMiddleware = require("../middleware/authentication");
const { getBalance } = require("../controllers/accountController");

const router = express.Router();

router.get("/balance", authMiddleware, getBalance);

module.exports = router;
