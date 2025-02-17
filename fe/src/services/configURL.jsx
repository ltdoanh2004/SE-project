import axios from "axios";
//import { localServ } from "./localService";
export const BASE_URL = "https://65f5be1941d90c1c5e0a11ef.mockapi.io";

export let https = axios.create({
  baseURL: BASE_URL,
});
