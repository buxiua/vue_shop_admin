import axios from "axios";

axios.defaults.baseURL = "http://vueshop.pixiv.download/api/private/v1/";

axios.interceptors.request.use(function (config) {
  if (config.url !== "login") {
    const token = window.sessionStorage.getItem("token");
    config.headers.Authorization = token;
  }

  return config;
});

export default axios;
