import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { FiBell, FiUser, FiLogOut, FiArrowLeft } from "react-icons/fi";
import "../../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const profileImage = localStorage.getItem("profileImage");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getTitle = () => {
    const path = location.pathname.split("/").filter(Boolean);
    return path.length === 1
      ? "Dashboard"
      : path[path.length - 1].charAt(0).toUpperCase() +
          path[path.length - 1].slice(1);
  };

  return (
    <div className="navbarclass">
    <header className="navbar">
  {/* LEFT - LOGO */}
  <div className="nav-left">
    <button className="back-btn" onClick={() => navigate(-1)}>
      <FiArrowLeft />
    </button>
    <img
      src="/logopng.png"
      alt="logo"
      className="logo"
      onClick={() => navigate("")}
    />
  </div>

  {/* CENTER - TITLE */}
  <div className="nav-center">
    <span className="page-title">{getTitle()}</span>
  </div>

  {/* RIGHT */}
  <div className="nav-right">
    

    <FiBell className="nav-icon" />

    <div className="profile-trigger" onClick={() => setShowMenu(!showMenu)}>
  {profileImage ? <img src={profileImage} alt="profile" /> : <FiUser />}
</div>

{showMenu && (
  <div className="profile-dropdown">
    <div className="profile-box">
      
      {/* PROFILE IMAGE */}
      <div className="profile-image-wrapper">
        {profileImage ? (
          <img src={profileImage} alt="profile" />
        ) : (
          <FiUser />
        )}
      </div>

      {/* USER INFO */}
      <div className="profile-info">
        <div className="name">{username}</div>
        <div className="role">{role}</div>
      </div>

      {/* LOGOUT */}
      <button className="logout-btn" onClick={handleLogout}>
        <FiLogOut /> Logout
      </button>

    </div>
  </div>
)}
  </div>
</header>
</div>
  );
};

export default Navbar;