import axios from "axios";

const token = localStorage.getItem("token");
// console.log(token);
export const axiosClient = () =>
  axios.create({
    baseURL: "https://note-app-api-dsjk.onrender.com/api/v1",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
