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
        name: "welcome",
        component: () => import("@/components/ShopWelcom.vue"),
      },
      {
        path: "/users",
        name: "users",
        component: () => import("@/components/user/Users.vue"),
      },
      {
        path: "/rights",
        name: "rights",
        component: () => import("@/components/power/ShopRights.vue"),
      },
      {
        path: "/roles",
        name: "roles",
        component: () => import("@/components/power/ShopeRoles.vue"),
      },
      {
        path: "/goods",
        name: "goods",
        component: () => import("@/components/good/ShopGood.vue"),
      },
      {
        path: "/good/:action",
        name: "goodEdit",
        component: () => import("@/components/good/GoodEdit.vue"),
        props: true,
      },
      {
        path: "/params",
        name: "params",
        component: () => import("@/components/good/ShopParam.vue"),
      },
      {
        path: "/categories",
        name: "categories",
        component: () => import("@/components/good/ShopCategory.vue"),
      },
      {
        path: "/orders",
        name: "orders",
        component: () => import("@/components/order/ShopOrder.vue"),
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
