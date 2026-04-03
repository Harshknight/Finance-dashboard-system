// src/controllers/dashboard.controller.js
import Record from "../models/record.model.js";

export const getSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // ✅ 1. Total Income / Expense / Balance
    const totals = await Record.aggregate([
      { $match: { createdBy: userId } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    let income = 0;
    let expense = 0;

    totals.forEach((t) => {
      if (t._id === "income") income = t.total;
      if (t._id === "expense") expense = t.total;
    });

    // ✅ 2. Category-wise totals
   const categoryTotalsRaw = await Record.aggregate([
  { $match: { createdBy: userId } },
  {
    $group: {
      _id: "$category",
      total: { $sum: "$amount" },
    },
  },
  { $sort: { total: -1 } },
]);

// ✅ Format response (clean API)
const categoryTotals = categoryTotalsRaw.map((c) => ({
  category: c._id,
  total: c.total,
}));
    // ✅ 3. Monthly trends
    const monthlyTrendsRaw = await Record.aggregate([
  { $match: { createdBy: userId } },
  {
    $group: {
      _id: {
        year: { $year: "$date" },
        month: { $month: "$date" },
      },
      income: {
        $sum: {
          $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
        },
      },
      expense: {
        $sum: {
          $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
        },
      },
    },
  },
  { $sort: { "_id.year": 1, "_id.month": 1 } },
]);

const monthlyTrends = monthlyTrendsRaw.map((m) => ({
  year: m._id.year,
  month: m._id.month,
  income: m.income,
  expense: m.expense,
}));
    // ✅ 4. Weekly trends (optional but strong)
    const weeklyTrendsRaw = await Record.aggregate([
  { $match: { createdBy: userId } },
  {
    $group: {
      _id: {
        year: { $year: "$date" },
        week: { $week: "$date" },
      },
      total: { $sum: "$amount" },
    },
  },
  { $sort: { "_id.year": 1, "_id.week": 1 } },
]);

const weeklyTrends = weeklyTrendsRaw.map((w) => ({
  year: w._id.year,
  week: w._id.week,
  total: w.total,
}));

    // ✅ 5. Recent activity (last 5 records)
    const recentActivity = await Record.find({ createdBy: userId })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    res.json({
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense,

      categoryTotals,
      monthlyTrends,
      weeklyTrends,
      recentActivity,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};