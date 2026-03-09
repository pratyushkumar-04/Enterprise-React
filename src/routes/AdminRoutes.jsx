import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import StudentList from "../pages/admin/students/StudentList";
import Dashboard from "../pages/admin/Dashboard"

const AdminRoutes = () => {
  return (
   <AdminLayout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<StudentList />} />
      </Routes>
    </AdminLayout>  
  );
};

export default AdminRoutes;
