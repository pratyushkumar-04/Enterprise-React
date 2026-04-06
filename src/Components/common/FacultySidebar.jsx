import React from "react";
import { NavLink } from "react-router-dom";

const FacultySidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/faculty" },
    { name: "Courses", path: "/faculty/courses" },
    { name: "Students", path: "/faculty/students" },
    { name: "Assignments", path: "/faculty/assignments" },
    { name: "Profile", path: "/faculty/profile" },
  ];

  return (
    <div className="w-64 bg-white shadow-md h-full p-4">
      <h2 className="text-xl font-semibold mb-6">Faculty Panel</h2>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/faculty"}
            className={({ isActive }) =>
              `px-4 py-2 rounded-md transition ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default FacultySidebar;