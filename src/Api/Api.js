import axios from "axios";

const url = process.env.REACT_APP_API_URL || "http://localhost:3000"

export const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  baseURL: url
})
