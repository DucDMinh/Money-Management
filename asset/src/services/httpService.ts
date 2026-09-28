import { UserInfo } from "@/interfaces/user";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export const TOKEN_KEY = "token";
export const USER_KEY = "user";

class Services {
  axios: AxiosInstance;

  constructor() {
    this.axios = axios;
    this.axios.defaults.withCredentials = false;
    this.axios.defaults.baseURL = "http://localhost:3000"
    this.axios.interceptors.request.use(
      function (config) {
        if (config.headers) {
          config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
        }
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    //! Interceptor response
    this.axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const { status } = error?.response || {};
        if (status === 401) {
          window.localStorage.clear();
          window.location.reload();
        }

        return Promise.reject(error);
      }
    );
  }

  attachTokenToHeader(token: string) {
    this.axios.interceptors.request.use(
      function (config) {
        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  }

  setupInterceptors() {
    this.axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const { status } = error?.response || {};
        if (status === 401) {
          window.localStorage.clear();
          window.location.reload();
        }

        return Promise.reject(error);
      }
    );
  }

  get(url: string, config?: AxiosRequestConfig) {
    return this.axios.get(url, config);
  }

  post(url: string, data: any, config?: AxiosRequestConfig) {
    return this.axios.post(url, data, config);
  }

  delete(url: string, config?: AxiosRequestConfig) {
    return this.axios.delete(url, config);
  }

  put(url: string, data: any, config?: AxiosRequestConfig) {
    return this.axios.put(url, data, config);
  }

  saveTokenStorage(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getTokenStorage() {
    const token = localStorage.getItem(TOKEN_KEY);
    return token || "";
  }

  clearStorage() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  saveUserStorage(user: UserInfo) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUserStorage() {
    if (localStorage.getItem(USER_KEY)) {
      return JSON.parse(localStorage?.getItem(USER_KEY) || "") as UserInfo;
    }

    return null;
  }
}

export default new Services();
