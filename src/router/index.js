import { createRouter, createWebHistory } from "vue-router";

export const routes = [
  {
    path: "/",
    component: () => import("@/layout"),
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("@/views/home"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: "active",
  routes,
  scrollBehavior: (to) => {
    if (to.hash) {
      return { el: to.hash };
    } else {
      return { top: 0 };
    }
  },
});

export default router;
