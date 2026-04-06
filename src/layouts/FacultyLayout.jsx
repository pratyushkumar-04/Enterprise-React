import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar"; 
import FacultySidebar from "../components/common/FacultySidebar";

const FacultyLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Body Section */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <FacultySidebar />

        {/* Page Content */}
        <main className="flex-1 p-4 overflow-y-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FacultyLayout;