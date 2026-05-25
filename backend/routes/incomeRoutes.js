const express = require("express");
const router = express.Router();
const {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadIncomeExcel,
} = require("../controllers/incomeController");
const { protect } = require("../middleware/authMiddleware");

router.post("/add", protect, addIncome);
router.get("/getAll", protect, getAllIncome);
router.delete("/:id", protect, deleteIncome);
router.get("/downloadExcel", protect, downloadIncomeExcel);

module.exports = router;