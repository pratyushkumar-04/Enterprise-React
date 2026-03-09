import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../auth/Login";
import Unauthorized from "../auth/Unauthorized";

import AdminLayout from "../layouts/AdminLayout";
import FacultyLayout from "../layouts/FacultyLayout";
import StudentLayout from "../layouts/StudentLayout";


import ProtectedRoute from "../Components/common/ProtectedRoute";
import RoleRoute from "../Components/common/RoleRoute";

import AdminDashboard from "../pages/admin/Dashboard";
import FacultyDashboard from "../pages/faculty/Dashboard";
import StudentDashboard from "../pages/student/Dashboard";
import AdminRoutes from "./AdminRoutes";
import StudentList from "../pages/admin/students/StudentList";
import AddStudent from "../pages/admin/students/AddStudent";
import StudentRegistration from "../pages/admin/students/StudentRegistration";

const AppRoutes = () => {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ADMIN */}
      {/* <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["ADMIN"]}>
              <AdminRoutes></AdminRoutes>
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
      </Route> */}


      {/* Faculty */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["ADMIN"]}>
              <AdminLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<das />} />
        <Route path="students" element={<StudentList />} />
        <Route path="students/add" element={<StudentRegistration />} />
      </Route>

      {/* STUDENT */}
      <Route
        path="/student"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["STUDENT"]}>
              <StudentLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
      </Route>

      {/*  FALLBACK */}
      <Route path="*" element={<Navigate to="/login" />} />

    </Routes>
  );
};

export default AppRoutes;
