import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/css/index.less";
import "./assets/css/iconfont.css";

import axios from "./http/index.js";

Vue.config.productionTip = false;

// 在Vue上挂载 axios
Vue.prototype.$axios = axios;

// 注册filter
Vue.filter("dateFormat", function (value) {
  const date = new Date(value);
  const year = date.getFullYear() + "";
  const month = (date.getMonth() + 1 + "").padStart(2, "0");
  const day = (date.getDate() + "").padStart(2, "0");
  const hour = (date.getHours() + "").padStart(2, "0");
  const minute = (date.getMinutes() + "").padStart(2, "0");
  const second = (date.getSeconds() + "").padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
});

Vue.use(ElementUI);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
