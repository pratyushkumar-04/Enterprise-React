import React, { useState } from 'react'
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import campusImg from "../assets/Images/University.png"
import starIcon from "../assets/Images/best.png";
import naacIcon from "../assets/Images/naac.png";
import nirfIcon from "../assets/Images/nirf.png";
import { loginApi } from '../Services/AuthService';
import { jwtDecode } from 'jwt-decode';
import Loader from "../Components/common/Loader";



const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);



  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data:', { username, password });

    setError('');
    setLoading(true);

    try {
      const data = await loginApi(username, password);
      const token = data.token;
      localStorage.setItem('token', token);
      // console.log(token);

      const decoded = jwtDecode(token);
      const role = decoded.role;
      const id = decoded.id;

      localStorage.setItem("role", role);
      localStorage.setItem("username", decoded.sub);
      localStorage.setItem("id",id);

      if (role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (role === "FACULTY") {
        navigate("/faculty", { replace: true });
      } else if (role === "STUDENT") {
        navigate("/student", { replace: true });
      } else {
        navigate("/unauthorized");
      }

      // console.log(data.token);

    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid username or password");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
    finally {
    setLoading(false);
  }


  }

  return (
  <>
    {loading && <Loader overlay={true} />}

    <form onSubmit={handleSubmit}>
      <div className="login-page">
        <div className="loginform">
          <h1 className="login-title">LOGIN</h1>

          <div className="input-group">
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
            />
          </div>

          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />

            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <div className="error-box">{error}</div>}

          <button className="login-btn" disabled={loading}>
            {loading ? "Please wait..." : "Submit"}
          </button>

          <p className="login-footer">Contributing to India’s Future</p>
        </div>

        <div className="imagediv">
          <img src={campusImg} alt="Campus" />
          <div className="image-overlay">
            <h1>InnoSphere<br />University</h1>
          </div>
          <div className="badge-bar">
            <div className="badge-item">
              <img src={starIcon} alt="Best University" />
              <span>Best private university in MP</span>
            </div>
            <div className="badge-item">
              <img src={naacIcon} alt="NAAC" />
              <span>NAAC A+ Certified</span>
            </div>
            <div className="badge-item">
              <img src={nirfIcon} alt="NIRF" />
              <span>NIRF @11</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  </>
);

}

export default Login