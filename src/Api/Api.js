import axios from "axios";

const url = process.env.REACT_APP_API_URL || "http://localhost:3000"

export const axiosInstance = axios.create({
  baseURL: url
})
