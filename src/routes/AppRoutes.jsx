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
import GenerateRollNumbers from "../pages/admin/students/GenerateRollNumbers";
import Dashboard from "../pages/faculty/Dashboard";
import DepartmentsPage from "../pages/admin/Masters/DepartmentsPage";
import CourseMasterPage from "../pages/admin/Masters/CourseMasterPage";
import BranchMasterPage from "../pages/admin/Masters/BranchMasterPage";
import SectionMasterPage from "../pages/admin/Masters/SectionMasterPage";
import SubjectMasterPage from "../pages/admin/Masters/SubjectMasterPage";
import FacultyList from "../pages/admin/faculty/FacultyList";
import AddFacultyPage from "../pages/admin/faculty/AddFacultyPage";

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
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="departments" element={<DepartmentsPage/>}/>
        <Route path="courses" element={<CourseMasterPage/>}/>
        <Route path="branches" element={<BranchMasterPage/>}/>
        <Route path="sections" element={<SectionMasterPage/>}/>
        <Route path="subjects" element= {<SubjectMasterPage/>}/>
        <Route path="students" element={<StudentList />} />
        <Route path="students/add" element={<StudentRegistration />} />
        <Route path="students/rollnumber" element={<GenerateRollNumbers />} />

        <Route path="faculty" element={<FacultyList/>}/>
        <Route path="faculty/add" element={<AddFacultyPage/>}/>
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
