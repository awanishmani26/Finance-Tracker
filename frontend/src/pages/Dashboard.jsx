// export default Dashboard;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LuWallet,
  LuTrendingUp,
  LuTrendingDown,
  LuArrowRight,
  LuPlus,
} from "react-icons/lu";

import DashboardLayout from "../components/layouts/DashboardLayout";
import SummaryCard from "../components/SummaryCard";
import TransactionItem from "../components/TransactionItem";
import CustomPieChart from "../components/Charts/CustomPieChart";
import CustomBarChart from "../components/Charts/CustomBarChart";
import AddTransactionModal from "../components/AddTransactionModal";

import useUserAuth from "../hooks/useUserAuth";

import axiosInstance from "../utils/axiosInstance";

import { API_PATHS } from "../utils/apiPaths";

import {
  prepareExpenseBarData,
  preparePieChartData,
  formatCurrency,
} from "../utils/helper";

const Dashboard = () => {
  const { user } = useUserAuth();

  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.DASHBOARD);

      setData(res.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-state">
          Loading dashboard...
        </div>
      </DashboardLayout>
    );
  }

  // Financial Overview Pie Data
  const financialPieData = [
    {
      name: "Total Balance",
      value: data?.totalBalance || 0,
    },
    {
      name: "Total Expenses",
      value: data?.totalExpenses || 0,
    },
    {
      name: "Total Income",
      value: data?.totalIncome || 0,
    },
  ];

  // Expense Chart Data
  const last30DaysBarData = prepareExpenseBarData(
    data?.last30DaysExpenses || []
  );

  // Income Pie Data
  const incomePieData = preparePieChartData(
    data?.last60DaysIncome || [],
    "source"
  );

  return (
    <DashboardLayout>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "var(--text-primary)",
            }}
          >
            Dashboard
          </h1>

          <p
            style={{
              color: "var(--text-secondary)",
              marginTop: "6px",
              fontSize: "14px",
            }}
          >
            Welcome back, {user?.name}
          </p>
        </div>

        {/* Google Classroom Style Add Button */}
        <button
          onClick={() => setOpenModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#1a73e8",
            color: "#fff",
            border: "none",
            padding: "14px 22px",
            borderRadius: "999px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "15px",
            boxShadow: "0 4px 14px rgba(26,115,232,0.25)",
            transition: "0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 8px 20px rgba(26,115,232,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 4px 14px rgba(26,115,232,0.25)";
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LuPlus size={18} />
          </div>

          Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <SummaryCard
          icon={<LuWallet />}
          title="Total Balance"
          amount={data?.totalBalance || 0}
          type="balance"
        />

        <SummaryCard
          icon={<LuTrendingUp />}
          title="Total Income"
          amount={data?.totalIncome || 0}
          type="income"
        />

        <SummaryCard
          icon={<LuTrendingDown />}
          title="Total Expenses"
          amount={data?.totalExpenses || 0}
          type="expense"
        />
      </div>

      {/* Recent Transactions + Financial Overview */}
      <div className="dashboard-grid">

        {/* Recent Transactions */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              Recent Transactions
            </div>

            <button
              className="see-all-btn"
              onClick={() => navigate("/expense")}
            >
              See All <LuArrowRight size={14} />
            </button>
          </div>

          {data?.recentTransactions?.length > 0 ? (
            data.recentTransactions.map((item) => (
              <TransactionItem
                key={item._id}
                item={item}
                type={item.type}
              />
            ))
          ) : (
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: 13,
                textAlign: "center",
                padding: "20px 0",
              }}
            >
              No transactions yet
            </p>
          )}
        </div>

        {/* Financial Overview */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              Financial Overview
            </div>
          </div>

          <CustomPieChart
            data={financialPieData}
            label="Total Balance"
            totalLabel={formatCurrency(
              data?.totalBalance || 0
            )}
          />
        </div>
      </div>

      {/* Expenses + Expense Chart */}
      <div className="dashboard-grid">

        {/* Expenses */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              Expenses
            </div>

            <button
              className="see-all-btn"
              onClick={() => navigate("/expense")}
            >
              See All <LuArrowRight size={14} />
            </button>
          </div>

          {data?.last5Expenses?.length > 0 ? (
            data.last5Expenses.map((item) => (
              <TransactionItem
                key={item._id}
                item={item}
                type="expense"
              />
            ))
          ) : (
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: 13,
                textAlign: "center",
                padding: "20px 0",
              }}
            >
              No expenses yet
            </p>
          )}
        </div>

        {/* Expense Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              Last 30 Days Expenses
            </div>
          </div>

          {last30DaysBarData.length > 0 ? (
            <CustomBarChart
              data={last30DaysBarData}
            />
          ) : (
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: 13,
                textAlign: "center",
                padding: "40px 0",
              }}
            >
              No expense data for last 30 days
            </p>
          )}
        </div>
      </div>

      {/* Income Pie + Income List */}
      <div className="dashboard-grid">

        {/* Income Pie */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              Last 60 Days Income
            </div>
          </div>

          {incomePieData.length > 0 ? (
            <CustomPieChart
              data={incomePieData}
              label="Total Income"
              totalLabel={formatCurrency(
                data?.totalIncome || 0
              )}
            />
          ) : (
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: 13,
                textAlign: "center",
                padding: "40px 0",
              }}
            >
              No income data for last 60 days
            </p>
          )}
        </div>

        {/* Last 5 Income */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              Income
            </div>

            <button
              className="see-all-btn"
              onClick={() => navigate("/income")}
            >
              See All <LuArrowRight size={14} />
            </button>
          </div>

          {data?.last5Income?.length > 0 ? (
            data.last5Income.map((item) => (
              <TransactionItem
                key={item._id}
                item={item}
                type="income"
              />
            ))
          ) : (
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: 13,
                textAlign: "center",
                padding: "20px 0",
              }}
            >
              No income yet
            </p>
          )}
        </div>
      </div>

      {/* Modal Popup */}
      {openModal && (
        <AddTransactionModal
          onClose={() => {
            setOpenModal(false);

            // refresh dashboard after add
            fetchDashboard();
          }}
        />
      )}

    </DashboardLayout>
  );
};

export default Dashboard;