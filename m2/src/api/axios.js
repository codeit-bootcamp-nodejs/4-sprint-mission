import axios from "axios";

const instance = axios.create({
  	baseURL: "https://panda-market-api-crud.vercel.app",
});

export default instance;