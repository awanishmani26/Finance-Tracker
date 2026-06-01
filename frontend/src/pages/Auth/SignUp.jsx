import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuEye, LuEyeOff, LuTrendingUp } from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";
import { useUser } from "../../context/UserContext";
import ProfilePhotoSelector from "../../components/ProfilePhotoSelector";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password) {
      setError("Please fill all fields");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      let profileImageUrl = null;

      // First register the user
      const res = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
      });

      // If image selected, upload it after registration
      if (profileImage) {
        const token = res.data.token;
        const formData = new FormData();
        formData.append("image", profileImage);

        const uploadRes = await axiosInstance.post(
          API_PATHS.AUTH.UPLOAD_IMAGE,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        profileImageUrl = uploadRes.data.imageUrl;
      }

      login(res.data.token, { ...res.data, profileImageUrl });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">Finance Tracker</div>
        <div className="auth-form-container">
          <h1 className="auth-title">Create an Account</h1>
          <p className="auth-subtitle">
            Join us today by entering your details below.
          </p>

          <ProfilePhotoSelector
            image={profileImage}
            setImage={setProfileImage}
            preview={profilePreview}
            setPreview={setProfilePreview}
          />

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="John"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
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
              {loading ? "Creating account..." : "SIGN UP"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
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

          <div
            style={{
              background: "rgba(255,255,255,0.12)",
              borderRadius: 16,
              padding: "20px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <h3 style={{ color: "white", fontSize: 15, marginBottom: 14 }}>
              All Transactions
            </h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginBottom: 16 }}>
              2nd Jan to 21th Dec
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Jan", "Feb", "Mar", "Apr", "May"].map((month, i) => (
                <div key={month} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, width: 28 }}>
                    {month}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 8,
                      background: "rgba(255,255,255,0.15)",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${[40, 65, 55, 80, 45][i]}%`,
                        height: "100%",
                        background: "rgba(255,255,255,0.7)",
                        borderRadius: 4,
                      }}
                    />
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

export default SignUp;
