const express = require("express");
const authMiddleware = require("../middleware/authentication");
const {
  getTransactions,
  transferFunds,
} = require("../controllers/transactionController");

const router = express.Router();

router.get("/", authMiddleware, getTransactions);
router.post("/transfer", authMiddleware, transferFunds);

module.exports = router;
