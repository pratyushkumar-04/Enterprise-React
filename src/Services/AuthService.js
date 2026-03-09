import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AUTH_BASE_URL = "http://localhost:8080/auth";

export const loginApi = async (username, password) => {
  const response = await axios.post(`${AUTH_BASE_URL}/login`, {
    username,
    password,
  });

  const token = response.data.token;

  // store token
  localStorage.setItem("token", token);

  // decode token
  const decoded = jwtDecode(token);

  // store role & username
  localStorage.setItem("role", decoded.role);
  localStorage.setItem("username", decoded.sub);

  return response.data;
};

export const logout = () => {
  localStorage.clear();
};
