import { useEffect, useState } from "react";
import { LuPlus, LuDownload, LuX, LuTrash2 } from "react-icons/lu";
import DashboardLayout from "../components/layouts/DashboardLayout";
import CustomBarChart from "../components/Charts/CustomBarChart";
import IconPicker from "../components/IconPicker";
import useUserAuth from "../hooks/useUserAuth";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import { prepareIncomeBarData, formatCurrency, formatDate } from "../utils/helper";

const Income = () => {
  useUserAuth();

  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    icon: "",
    source: "",
    amount: "",
    date: "",
  });

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.INCOME.GET_ALL);
      setIncomes(res.data);
    } catch (err) {
      console.error("Income fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.source || !form.amount || !form.date) {
      setFormError("Source, amount and date are required");
      return;
    }

    setSubmitting(true);
    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD, {
        icon: form.icon,
        source: form.source,
        amount: Number(form.amount),
        date: form.date,
      });
      setShowModal(false);
      setForm({ icon: "", source: "", amount: "", date: "" });
      fetchIncomes();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to add income");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE(id));
      fetchIncomes();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const chartData = prepareIncomeBarData(incomes);

  return (
    <DashboardLayout>
      {/* Income Overview Chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Income Overview</div>
            <div className="card-subtitle">
              Track your earnings over time and analyze your income trends.
            </div>
          </div>
          {/* add income buttom */}
          <button className="add-btn" onClick={() => setShowModal(true)}>
            <LuPlus size={16} /> Add Income
          </button>
          
        </div>
        {chartData.length > 0 ? (
          <CustomBarChart data={chartData} />
        ) : (
          <div className="loading-state">
            No income data yet. Add your first income!
          </div>
        )}
      </div>

      {/* Income Sources List */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Income Sources</div>
          <button className="download-btn" onClick={handleDownload}>
            <LuDownload size={14} /> Download
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : incomes.length === 0 ? (
          <p style={{ color: "var(--text-secondary)", fontSize: 13, textAlign: "center", padding: "30px 0" }}>
            No income records found. Add your first income!
          </p>
        ) : (
          <div className="list-grid">
            {incomes.map((item) => (
              <div key={item._id} className="list-item">
                <div className="list-item-icon">
                  {item.icon ? (
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                  ) : (
                    <span style={{ fontSize: 20 }}>💰</span>
                  )}
                </div>
                <div className="list-item-info">
                  <div className="list-item-name">{item.source}</div>
                  <div className="list-item-date">{formatDate(item.date)}</div>
                </div>
                <div className="list-item-right">
                  <span className="amount-badge badge-income">
                    + {formatCurrency(item.amount)} ↗
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

      {/* Add Income Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add Income</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <LuX size={16} />
              </button>
            </div>

            <IconPicker icon={form.icon} setIcon={(val) => setForm({ ...form, icon: val })} />

            {formError && <div className="error-msg">{formError}</div>}

            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label>Income Source</label>
                <input
                  type="text"
                  placeholder="Freelance Development"
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  placeholder="5000"
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
                <button type="submit" className="btn-primary" style={{ width: "auto", padding: "11px 28px" }} disabled={submitting}>
                  {submitting ? "Adding..." : "Add Income"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Income;
