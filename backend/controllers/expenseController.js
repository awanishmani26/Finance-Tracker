const Expense = require("../models/Expense");
const xlsx = require("xlsx");
const axios = require("axios");
// @desc    Add expense
// @route   POST /api/v1/expense/add
// @access  Private
const addExpense = async (req, res) => {
  const { icon, category, amount, date } = req.body;

  if (!category || !amount || !date) {
    return res
      .status(400)
      .json({ message: "Category, amount and date are required" });
  }
   if (text) {
    try {
      const response = await axios.post(
        "https://expense-nlp.onrender.com/predict",
        {
          text,
        }
      );

      category = response.data.category;
      icon = response.data.icon;
    } catch (err) {
      console.log("NLP Error:", err.message);
    }
  }

  try {
    const expense = await Expense.create({
      userId: req.user._id,
      icon,
      category,
      amount,
      date: new Date(date),
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all expenses for user
// @route   GET /api/v1/expense/getAll
// @access  Private
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({
      date: -1,
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/v1/expense/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await expense.deleteOne();
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Download expense as Excel
// @route   GET /api/v1/expense/downloadExcel
// @access  Private
const downloadExpenseExcel = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({
      date: -1,
    });

    const data = expenses.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: new Date(item.date).toLocaleDateString("en-IN"),
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expense");

    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=expense_details.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addExpense,
  getAllExpenses,
  deleteExpense,
  downloadExpenseExcel,
};