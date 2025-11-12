// src/App.js
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import UploadFile from "./components/UploadFile";
import { AuthContext } from "./contexts/AuthContext";


function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <UploadFile />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
