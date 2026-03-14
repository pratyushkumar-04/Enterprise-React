import { BrowserRouter } from "react-router-dom";
import './App.css'
import Login from './auth/Login'
import AppRoutes from "./routes/AppRoutes";
import StudentRegistration from "./pages/admin/students/StudentRegistration";
import { Toaster } from "react-hot-toast";


function App() {

  return (
   <BrowserRouter>
    <Toaster position="top-right" reverseOrder={false} />
   <AppRoutes></AppRoutes>
   </BrowserRouter>
  )
}

export default App
