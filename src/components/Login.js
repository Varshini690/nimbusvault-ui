// src/components/Login.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../contexts/AuthContext"; // ✅ context for token handling

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext); // ✅ login function from context
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter both username and password ❗");
      return;
    }

    try {
      // ✅ Authenticate user
      const res = await api.post("/auth/login", { username, password });
      const token = res.data.access_token;

      if (!token) {
        alert("Login failed ❌ No token received from server.");
        return;
      }

      // ✅ Store JWT token globally
      login(token);

      // ✅ Slight delay ensures token is stored before redirect
      setTimeout(() => {
        alert("Login successful ✅");
        navigate("/upload");
      }, 300);
    } catch (err) {
      console.error("Login failed:", err);
      if (err.response?.status === 401) {
        alert("Invalid username or password ❌");
      } else if (err.response?.status === 422) {
        alert("Server error — please try again later ⚠️");
      } else {
        alert(err.response?.data?.error || "Login failed ❌");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-[400px]">
        <h2 className="text-2xl font-semibold text-center mb-6 text-purple-700">
          Login to NimbusVault ☁️
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
          />
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 rounded-md transition"
          >
            Login 🚀
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-5 text-center">
          Don’t have an account?{" "}
          <span
            className="text-purple-600 font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
