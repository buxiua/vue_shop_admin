import Vue from "vue";
import VueRouter from "vue-router";
import ShopLogin from "@/components/ShopLogin.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/components/ShopHome.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: ShopLogin,
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  console.log(to);
  if (to.path === "/home") {
    if (window.sessionStorage.getItem("token") !== null) {
      return next();
    }
    return next("/login");
  }
  return next();
});

export default router;
