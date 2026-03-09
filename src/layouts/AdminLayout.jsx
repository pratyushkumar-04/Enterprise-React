import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import "../styles/layout.css";
import AdminSidebar from "../Components/common/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="app-layout">
      <AdminSidebar />
      <div className="main-section">
        <Navbar />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
