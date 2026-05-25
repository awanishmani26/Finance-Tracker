const Income = require("../models/Income");
const Expense = require("../models/Expense");
const moment = require("moment");

// @desc    Get dashboard data
// @route   GET /api/v1/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all income and expenses
    const totalIncomeAgg = await Income.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpenseAgg = await Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalIncome = totalIncomeAgg[0]?.total || 0;
    const totalExpenses = totalExpenseAgg[0]?.total || 0;
    const totalBalance = totalIncome - totalExpenses;

    // Recent transactions (last 5 from each, merged and sorted)
    const recentIncome = await Income.find({ userId })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    const recentExpenses = await Expense.find({ userId })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    const recentTransactions = [
      ...recentIncome.map((item) => ({ ...item, type: "income" })),
      ...recentExpenses.map((item) => ({ ...item, type: "expense" })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Last 30 days expenses (for bar chart on dashboard)
    const thirtyDaysAgo = moment().subtract(30, "days").toDate();
    const last30DaysExpenses = await Expense.find({
      userId,
      date: { $gte: thirtyDaysAgo },
    })
      .sort({ date: 1 })
      .lean();

    // Last 60 days income (for pie chart on dashboard)
    const sixtyDaysAgo = moment().subtract(60, "days").toDate();
    const last60DaysIncome = await Income.find({
      userId,
      date: { $gte: sixtyDaysAgo },
    })
      .sort({ date: 1 })
      .lean();

    // Last 5 income for dashboard income list
    const last5Income = await Income.find({ userId })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    // Last 5 expenses for dashboard expense list
    const last5Expenses = await Expense.find({ userId })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    res.json({
      totalBalance,
      totalIncome,
      totalExpenses,
      recentTransactions,
      last30DaysExpenses,
      last60DaysIncome,
      last5Income,
      last5Expenses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getDashboardData };