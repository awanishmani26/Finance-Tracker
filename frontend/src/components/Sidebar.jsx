import { useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuWallet,
  LuTrendingDown,
  LuLogOut,
  LuUser,
} from "react-icons/lu";
import { useUser } from "../context/UserContext";
import { BASE_URL, API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";

const Sidebar = () => {
  const { user, logout, updateUser } = useUser();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAvatarClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    updateUser({ profileImageUrl: URL.createObjectURL(file) });
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await axiosInstance.post(API_PATHS.AUTH.UPLOAD_IMAGE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.imageUrl) updateUser({ profileImageUrl: res.data.imageUrl });
    } catch (err) {
      console.error("Avatar upload error:", err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const navItems = [
    { path: "/dashboard", icon: <LuLayoutDashboard />, label: "Dashboard" },
    { path: "/income",    icon: <LuWallet />,          label: "Income"    },
    { path: "/expense",   icon: <LuTrendingDown />,    label: "Expense"   },
  ];

  const avatarSrc = user?.profileImageUrl || null;
  console.log("USER CONTEXT:", user);
  return (
    <aside className="sidebar">

      <div className="sidebar-brand">Expense Tracker</div>

      <div className="sidebar-profile">
        <div onClick={handleAvatarClick} style={{ cursor: "pointer", position: "relative" }}>
          {avatarSrc ? (
           // <img src={avatarSrc} alt="profile" className="sidebar-avatar"
             // style={{ opacity: uploading ? 0.6 : 1 }} />
            <img src={avatarSrc} alt="profile" className="sidebar-avatar"
              style={{ opacity: uploading ? 0.6 : 1 }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="sidebar-avatar-placeholder"><LuUser /></div>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*"
          style={{ display: "none" }} onChange={handleFileChange} />
        <h3 className="sidebar-username">{user?.fullName}</h3>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        <div className="nav-item" onClick={handleLogout}
          style={{ marginTop: "auto", cursor: "pointer" }}>
          <span className="nav-icon"><LuLogOut /></span>
          Logout
        </div>
      </nav>

    </aside>
  );
};

export default Sidebar;
