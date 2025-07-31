// api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://panda-market-api-crud.vercel.app/articles',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 2000,
});

export default axiosInstance;
