import axios from "axios";

// Axios instance for making request to the backend
const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

export default axiosInstance;
