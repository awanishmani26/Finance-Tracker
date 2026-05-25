import moment from "moment";

export const formatDate = (date) => {
  return moment(date).format("Do MMM YYYY");
};

export const formatCurrency = (amount) => {
  return `Rs. ${Number(amount).toLocaleString("en-IN")}`;
};

export const prepareIncomeBarData = (incomeData) => {
  const sortedData = [...incomeData].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  return sortedData.map((item) => ({
    month: moment(item.date).format("Do MMM"),
    amount: item.amount,
    source: item.source,
  }));
};

export const prepareExpenseLineData = (expenseData) => {
  const sortedData = [...expenseData].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  return sortedData.map((item) => ({
    month: moment(item.date).format("Do MMM"),
    amount: item.amount,
    category: item.category,
  }));
};

export const prepareExpenseBarData = (expenseData) => {
  const sortedData = [...expenseData].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  return sortedData.map((item) => ({
    day: moment(item.date).format("Do MMM"),
    amount: item.amount,
  }));
};

export const preparePieChartData = (data, key) => {
  const aggregated = {};
  data.forEach((item) => {
    const label = item[key];
    aggregated[label] = (aggregated[label] || 0) + item.amount;
  });
  return Object.entries(aggregated).map(([name, value]) => ({ name, value }));
};