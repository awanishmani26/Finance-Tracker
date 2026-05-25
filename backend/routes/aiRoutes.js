const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const aiController = require("../controllers/aiController");

router.post(
  "/process",
  authMiddleware.protect,
  aiController.processTransaction
);

module.exports = router;