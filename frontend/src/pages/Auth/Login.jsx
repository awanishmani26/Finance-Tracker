import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuEye, LuEyeOff, LuTrendingUp } from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useUser } from "../../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
      login(res.data.token, res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">Finance Tracker</div>
        <div className="auth-form-container">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Please enter your details to log in</p>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 Characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <LuEye size={18} /> : <LuEyeOff size={18} />}
                </span>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/signup">SignUp</Link>
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
          <div className="auth-info-card">
            <div className="auth-info-icon">
              <LuTrendingUp />
            </div>
            <div className="auth-info-text">
              <h3>Track Your Income & Expenses</h3>
              <p>Rs.430,000</p>
            </div>
          </div>

          <div style={{
            background: "rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: "20px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}>
            <h3 style={{ color: "white", fontSize: 15, marginBottom: 14 }}>All Transactions</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginBottom: 16 }}>
              2nd Jan to 21th Dec
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Jan", "Feb", "Mar", "Apr", "May"].map((month, i) => (
                <div key={month} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, width: 28 }}>{month}</span>
                  <div style={{
                    flex: 1,
                    height: 8,
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}>
                    <div style={{
                      width: `${[40, 65, 55, 80, 45][i]}%`,
                      height: "100%",
                      background: "rgba(255,255,255,0.7)",
                      borderRadius: 4,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
