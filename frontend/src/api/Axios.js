import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Laravel API URL
  withCredentials: true, // needed for cookies or authentication
});

export default api;
