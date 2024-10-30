import axios, {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
  } from "axios";
  import router from "./router";
  import Cookies from 'js-cookie';
  
  
  const DEFAULT_CONTENT_TYPE: string = "application/json";
  
  const getBearerToken = (): string => {
    const accessToken = Cookies.get("auth_token")
    return `Bearer ${accessToken}`;
  };
  
  const getBaseUrl = (): string => {
    return window.GLOBAL_CONFIG.API_URL;
  };
  
  const getApiUrl = (r: string): string => {
    if (r === "auth") {
      return `${getBaseUrl()}`;
    }
  
    return `${getBaseUrl()}/api/v1`;
  };
  
  const requestMiddleware = (config: InternalAxiosRequestConfig) => {
    config.baseURL = getApiUrl(config.url ?? "");
    config.headers["Accept"] = DEFAULT_CONTENT_TYPE;
    config.headers["Content-Type"] = DEFAULT_CONTENT_TYPE;
    config.headers["Authorization"] = getBearerToken();
    return config;
  };
  
  const responseFulfilled = async (response: AxiosResponse) => {
    return response;
  };
  
  const responseRejected = async (error: AxiosError) => {
    if (error.code === "ERR_NETWORK") {
      throw new Error("No-API-Found");
    }
  
    if (error.response?.status == 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      await router.push({name: "login" });
      throw new Error("No-Authorized");
    }
  
    if (error.response?.status == 403) {
      throw new Error("No-Allowed");
    }
  
    throw new Error((error.response?.data as { message: string }).message);
  };
  
  const client: AxiosInstance = axios.create();
  
  client.interceptors.request.use(requestMiddleware);
  client.interceptors.response.use(responseFulfilled, responseRejected);
  
  export default client;
  