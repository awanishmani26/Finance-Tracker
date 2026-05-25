import { useEffect, useState } from "react";
import { LuPlus, LuDownload, LuX, LuTrash2 } from "react-icons/lu";
import DashboardLayout from "../components/layouts/DashboardLayout";
import CustomLineChart from "../components/Charts/CustomLineChart";
import IconPicker from "../components/IconPicker";
import useUserAuth from "../hooks/useUserAuth";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { prepareExpenseLineData, formatCurrency, formatDate } from "../utils/helper";

const Expense = () => {
  useUserAuth();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    icon: "",
    category: "",
    amount: "",
    date: "",
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL);
      setExpenses(res.data);
    } catch (err) {
      console.error("Expense fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.category || !form.amount || !form.date) {
      setFormError("Category, amount and date are required");
      return;
    }

    setSubmitting(true);
    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD, {
        icon: form.icon,
        category: form.category,
        amount: Number(form.amount),
        date: form.date,
      });
      setShowModal(false);
      setForm({ icon: "", category: "", amount: "", date: "" });
      fetchExpenses();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to add expense");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE(id));
      fetchExpenses();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const chartData = prepareExpenseLineData(expenses);

  return (
    <DashboardLayout>
      {/* Expense Overview Line Chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Expense Overview</div>
            <div className="card-subtitle">
              Track your spending trends over time and gain insights into where your money goes.
            </div>
          </div>
          {/* add expense button */}
          <button className="add-btn" onClick={() => setShowModal(true)}>
            <LuPlus size={16} /> Add Expense
          </button>
          
        </div>
        {chartData.length > 0 ? (
          <CustomLineChart data={chartData} />
        ) : (
          <div className="loading-state">
            No expense data yet. Add your first expense!
          </div>
        )}
      </div>

      {/* All Expenses List */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">All Expenses</div>
          <button className="download-btn" onClick={handleDownload}>
            <LuDownload size={14} /> Download
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : expenses.length === 0 ? (
          <p style={{ color: "var(--text-secondary)", fontSize: 13, textAlign: "center", padding: "30px 0" }}>
            No expense records yet. Add your first expense!
          </p>
        ) : (
          <div className="list-grid">
            {expenses.map((item) => (
              <div key={item._id} className="list-item">
                <div className="list-item-icon">
                  {item.icon ? (
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                  ) : (
                    <span style={{ fontSize: 20 }}>💸</span>
                  )}
                </div>
                <div className="list-item-info">
                  <div className="list-item-name">{item.category}</div>
                  <div className="list-item-date">{formatDate(item.date)}</div>
                </div>
                <div className="list-item-right">
                  <span className="amount-badge badge-expense">
                    - {formatCurrency(item.amount)} ↘
                  </span>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item._id)}
                    title="Delete"
                  >
                    <LuTrash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add Expense</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <LuX size={16} />
              </button>
            </div>

            <IconPicker icon={form.icon} setIcon={(val) => setForm({ ...form, icon: val })} />

            {formError && <div className="error-msg">{formError}</div>}

            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  placeholder="Rent, Groceries, etc"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: "auto", padding: "11px 28px" }}
                  disabled={submitting}
                >
                  {submitting ? "Adding..." : "Add Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Expense;
