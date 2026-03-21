import { NavLink, useNavigate } from "react-router-dom";
import "../../styles/sidebar.css";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h2 className="logo">ERP Admin</h2>

      <nav>
        <NavLink to="/admin" end>
          Dashboard
        </NavLink>

        <NavLink to="/admin/students">
          Students
        </NavLink>
        <NavLink to="/admin/students/add">
          Add Student
        </NavLink>
        <NavLink to="/admin/students/rollnumber">
          Assign Roll Numbers
        </NavLink>
        <NavLink to="/admin/departments">
        Departments
        </NavLink>
        <NavLink to="/admin/courses">
        Courses
        </NavLink>
        <NavLink to="/admin/branches">
        Branches
        </NavLink >
        <NavLink to="/admin/sections">
        Sections
        </NavLink>
        <NavLink to="/admin/subjects">
        Subjects
        </NavLink>

        <NavLink to="/admin/faculty">
          Faculty
        </NavLink>

        <NavLink to="/admin/subjects">
          Subjects
        </NavLink>

        <NavLink to="/admin/attendance">
          Attendance
        </NavLink>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
