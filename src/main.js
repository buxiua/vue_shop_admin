import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/css/index.less";
import "./assets/css/iconfont.css";
import axios from "axios";

Vue.config.productionTip = false;

// 配置axios
axios.defaults.baseURL = "http://vueshop.pixiv.download/api/private/v1/";
Vue.prototype.$axios = axios;

Vue.use(ElementUI);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
