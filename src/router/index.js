import Vue from "vue";
import VueRouter from "vue-router";
import ShopLogin from "@/components/ShopLogin.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  // 使用命名路由导航到父路由，其嵌套子路由不会渲染，但刷新后会渲染。
  {
    path: "/home",
    component: () => import("@/components/ShopHome.vue"),
    children: [
      {
        // 默认子路有
        path: "/",
        name: "welcom",
        component: () => import("@/components/ShopWelcom.vue"),
      },
      {
        path: "/users",
        name: "users",
        component: () => import("@/components/user/Users.vue"),
      },
    ],
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
  if (to.path === "/home") {
    if (window.sessionStorage.getItem("token") !== null) {
      return next();
    }
    return next("/login");
  }
  return next();
});

export default router;
