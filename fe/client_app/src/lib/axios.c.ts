import { AuthStorage } from "@/util/auth_storage";
import axios, { AxiosInstance } from "axios";

let axiosMainServer: AxiosInstance;
let axiosImageServer: AxiosInstance;

export async function getAxiosMainServer(): Promise<AxiosInstance> {
  if (axiosMainServer) return axiosMainServer;

  const res = await fetch("/api/env");
  const config = await res.json();

  axiosMainServer = axios.create({
    baseURL: config.PHONE_SHOP_SERVER_HOST || "http://localhost:8080",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add interceptor
  axiosMainServer.interceptors.request.use(
    (config) => {
      const accountUid = AuthStorage.getAccountUid();
      if (accountUid) {
        config.headers["ACCOUNT_UID"] = accountUid;
        config.headers["TYPE"] = "CUSTOMER";
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return axiosMainServer;
}

export async function getAxiosImageServer(): Promise<AxiosInstance> {
  if (axiosImageServer) return axiosImageServer;

  const res = await fetch("/api/env");
  const config = await res.json();

  axiosImageServer = axios.create({
    baseURL: config.IMAGE_SERVER_HOST || "http://localhost:8000",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return axiosImageServer;
}

export async function getZaloPayRedirectUrl(): Promise<string> {
  const res = await fetch("/api/env");
  const config = await res.json();
  return config.ZALO_PAY_REDIRECT_URL || "http://localhost:4000";
}
