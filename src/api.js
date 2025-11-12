// frontend/src/api.js
import axios from "axios";

const api = axios.create({
 baseURL:
    process.env.REACT_APP_API_URL || "https://nimbusvault-backend.onrender.com",// Flask backend
});

export default api;
