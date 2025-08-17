import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/po",
      name: "po",
      component: () => import("../views/POView.vue"),
    },
    {
      path: "/polist",
      name: "polist",
      component: () => import("../views/POListView.vue"),
    },
    {
      path: "/poitem",
      name: "poitem",
      component: () => import("../views/POItemView.vue"),
    },
    {
      path: "/part",
      name: "part",
      component: () => import("../views/PartView.vue"),
    },
    {
      path: "/partlist",
      name: "partlist",
      component: () => import("../views/PartListView.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/help",
      name: "help",
      component: () => import("../views/HelpView.vue"),
    },
  ],
});

export default router;
