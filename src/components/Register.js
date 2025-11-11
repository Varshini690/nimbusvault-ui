// src/components/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", { username, password });
      alert(res.data.msg || "Registered successfully ✅");
      navigate("/upload");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-[400px]">
        <h2 className="text-2xl font-semibold text-center mb-6 text-[#111827]">
          Create Account ✨
        </h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
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
            Register 🚀
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-5 text-center">
          Already have an account?{" "}
          <span
            className="text-purple-600 font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
