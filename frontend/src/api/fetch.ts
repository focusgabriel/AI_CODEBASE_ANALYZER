import axios,{
  type AxiosError,
  type AxiosRequestConfig,
} from "axios";
import { PUBLIC_ROUTES } from "../constants";
// import toast from "react-hot-toast";


interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}
const refreshClient = axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

const tokenRefreshClient = axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

// response
  refreshClient.interceptors.response.use(
    
  (response) => {
    return response
  },
  
  async(error: AxiosError) => {
    
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if(error.response?.status === 401 && !originalRequest._retry){

      originalRequest._retry = true

      if (!originalRequest) {
        return Promise.reject(error);
      }
      try { 

      await tokenRefreshClient.post("/refresh", {}, {
        withCredentials: true,
      })


      return refreshClient(originalRequest)

    } catch(err) {
        // toast.error(err.response?.data?.message ?? "Session expired. Please log in again.", {
        //   position: "top-right",
        //   duration: 5000
        // });
        const isAuthPage = PUBLIC_ROUTES.some((route) =>
          window.location.pathname === route ||
          window.location.pathname.startsWith(route + "/")
        );

        if (!isAuthPage) {
          window.dispatchEvent(new Event("auth:logout"));
        }


        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
)

export default refreshClient;