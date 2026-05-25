const Income = require("../models/Income");
const xlsx = require("xlsx");

// @desc    Add income
// @route   POST /api/v1/income/add
// @access  Private
const addIncome = async (req, res) => {
  const { icon, source, amount, date } = req.body;

  if (!source || !amount || !date) {
    return res
      .status(400)
      .json({ message: "Source, amount and date are required" });
  }

  try {
    const income = await Income.create({
      userId: req.user._id,
      icon,
      source,
      amount,
      date: new Date(date),
    });
    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all income for user
// @route   GET /api/v1/income/getAll
// @access  Private
const getAllIncome = async (req, res) => {
  try {
    const income = await Income.find({ userId: req.user._id }).sort({
      date: -1,
    });
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete income
// @route   DELETE /api/v1/income/:id
// @access  Private
const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }
    if (income.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await income.deleteOne();
    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Download income as Excel
// @route   GET /api/v1/income/downloadExcel
// @access  Private
const downloadIncomeExcel = async (req, res) => {
  try {
    const income = await Income.find({ userId: req.user._id }).sort({
      date: -1,
    });

    // Prepare data
    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: new Date(item.date).toLocaleDateString("en-IN"),
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");

    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=income_details.xlsx"
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

module.exports = { addIncome, getAllIncome, deleteIncome, downloadIncomeExcel };