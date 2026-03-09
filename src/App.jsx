import { BrowserRouter } from "react-router-dom";
import './App.css'
import Login from './auth/Login'
import AppRoutes from "./routes/AppRoutes";
import StudentRegistration from "./pages/admin/students/StudentRegistration";

function App() {

  return (
   <BrowserRouter>
   <AppRoutes></AppRoutes>
   {/* <StudentRegistration></StudentRegistration> */}
   </BrowserRouter>
  )
}

export default App
