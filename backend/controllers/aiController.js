const axios = require("axios");

const Income = require("../models/Income");

const Expense = require("../models/Expense");

exports.processTransaction = async (req, res) => {

  try {

    const { text } = req.body;

    // const response = await axios.post(
    //   "http://127.0.0.1:8000/predict",
    //   { text }
    // );
    const response = await axios.post(
  `${process.env.AI_SERVICE_URL}/predict`,
  { text },
  { timeout: 60000 }
);

    const aiData = response.data;

    if (aiData.type === "income") {

      const income = await Income.create({

        userId: req.user._id,

        icon: aiData.icon,

        source: aiData.category,

        amount: aiData.amount,

        date: new Date(),
      });

      return res.status(201).json({
        success: true,
        transaction: income,
      });
    }

    else {

      const expense = await Expense.create({

        userId: req.user._id,

       icon: aiData.icon,

        category: aiData.category,

        amount: aiData.amount,

        date: new Date(),
      });

      return res.status(201).json({
        success: true,
        transaction: expense,
      });
    }

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "AI transaction failed",
    });
  }
};
