import axios from "axios";

// Axios instance for making request to the backend
const axiosInstance = axios.create({
  baseURL: "https://youtube-backend-cr9n.onrender.com/api",
  withCredentials: true,
});

export default axiosInstance;
