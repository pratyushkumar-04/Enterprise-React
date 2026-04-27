import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiChevronDown, FiChevronRight, FiLogOut } from "react-icons/fi";
import "../../styles/sidebar.css";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState({
    students: true,
    academic: false,
    faculty: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="sidebar-container">
      <div className="sidebar-header">
        <h2 className="sidebar-logo">ERP Admin</h2>
      </div>

      <nav className="nav-menu">
        <NavLink to="/admin" end className="nav-item">
          Dashboard
        </NavLink>

        {/* SECTION: STUDENTS */}
        <div className="nav-section">
          <div
            className="section-header"
            onClick={() => toggleSection("students")}
          >
            <span>Student Management</span>
            {openSections.students ? <FiChevronDown /> : <FiChevronRight />}
          </div>
          {openSections.students && (
            <div className="section-content">
              <NavLink to="/admin/students" end>
                All Students
              </NavLink>
              <NavLink to="/admin/students/add">Add Student</NavLink>
              <NavLink to="/admin/students/rollnumber">
                Assign Roll Numbers
              </NavLink>
            </div>
          )}
        </div>

        {/* SECTION: ACADEMIC */}
        <div className="nav-section">
          <div
            className="section-header"
            onClick={() => toggleSection("academic")}
          >
            <span>Academic Setup</span>
            {openSections.academic ? <FiChevronDown /> : <FiChevronRight />}
          </div>
          {openSections.academic && (
            <div className="section-content">
              <NavLink to="/admin/departments">Departments</NavLink>
              <NavLink to="/admin/courses">Courses</NavLink>
              <NavLink to="/admin/branches">Branches</NavLink>
              <NavLink to="/admin/sections">Sections</NavLink>
              <NavLink to="/admin/subjects">Subjects</NavLink>
            </div>
          )}
        </div>

        {/* SECTION: FACULTY */}
        <div className="nav-section">
          <div
            className="section-header"
            onClick={() => toggleSection("faculty")}
          >
            <span>Faculty</span>
            {openSections.faculty ? <FiChevronDown /> : <FiChevronRight />}
          </div>
          {openSections.faculty && (
            <div className="section-content">
              <NavLink to="/admin/faculty">All Faculty</NavLink>
              <NavLink to="/admin/faculty/add">Add Faculty</NavLink>
              <NavLink to="/admin/faculty/assign">Assign Subjects</NavLink>
            </div>
          )}
        </div>

        <NavLink to="/admin/attendance" className="nav-item">
          Attendance
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
