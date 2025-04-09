// Create an instance throughout the application

import axios from "axios";
import { getApiBaseUrl } from "./environment";

export const axiosIntance = axios.create({
    baseURL: getApiBaseUrl(),
    withCredentials: true,
});
