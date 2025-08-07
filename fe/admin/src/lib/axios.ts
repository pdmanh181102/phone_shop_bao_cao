import axios from "axios";
import { getAxiosImageServer, getAxiosMainServer } from "./axios.c";

export const axiosMainServer = {
  async get<T = any, R = any>(...args: Parameters<typeof axios.get<T, R>>) {
    const instance = await getAxiosMainServer();
    return instance.get<T, R>(...args);
  },
  async post<T = any, R = any>(...args: Parameters<typeof axios.post<T, R>>) {
    const instance = await getAxiosMainServer();
    return instance.post<T, R>(...args);
  },
  async put<T = any, R = any>(...args: Parameters<typeof axios.put<T, R>>) {
    const instance = await getAxiosMainServer();
    return instance.put<T, R>(...args);
  },
  async patch<T = any, R = any>(...args: Parameters<typeof axios.patch<T, R>>) {
    const instance = await getAxiosMainServer();
    return instance.patch<T, R>(...args);
  },
  async delete<T = any, R = any>(
    ...args: Parameters<typeof axios.delete<T, R>>
  ) {
    const instance = await getAxiosMainServer();
    return instance.delete<T, R>(...args);
  },
};

export const axiosImageServer = {
  async get<T = any, R = any>(...args: Parameters<typeof axios.get<T, R>>) {
    const instance = await getAxiosImageServer();
    return instance.get<T, R>(...args);
  },
  async post<T = any, R = any>(...args: Parameters<typeof axios.post<T, R>>) {
    const instance = await getAxiosImageServer();
    return instance.post<T, R>(...args);
  },
  async put<T = any, R = any>(...args: Parameters<typeof axios.put<T, R>>) {
    const instance = await getAxiosImageServer();
    return instance.put<T, R>(...args);
  },
  async patch<T = any, R = any>(...args: Parameters<typeof axios.patch<T, R>>) {
    const instance = await getAxiosImageServer();
    return instance.patch<T, R>(...args);
  },
  async delete<T = any, R = any>(
    ...args: Parameters<typeof axios.delete<T, R>>
  ) {
    const instance = await getAxiosImageServer();
    return instance.delete<T, R>(...args);
  },
};
