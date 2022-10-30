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

Vue.use(ElementUI);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
