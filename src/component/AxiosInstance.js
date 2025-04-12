import axios from "axios";
import axiosRetry from "axios-retry";
 
const api = axios.create({
  baseURL: `https://www.omdbapi.com`,
  timeout: 15000,
});
 
axiosRetry(api, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 2000,
  retryCondition: (err) => {
    return err.code === "ERR_NETWORK" || err.code === "ECONNABORTED";
  },
});
 
export default api;
 
 
