const express = require("express");
const router = express.Router();
const {
  addExpense,
  getAllExpenses,
  deleteExpense,
  downloadExpenseExcel,
} = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

router.post("/add", protect, addExpense);
router.get("/getAll", protect, getAllExpenses);
router.delete("/:id", protect, deleteExpense);
router.get("/downloadExcel", protect, downloadExpenseExcel);

module.exports = router;