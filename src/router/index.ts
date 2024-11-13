import { createRouter, createWebHistory } from "vue-router";
import Weather from "../views/Weather.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/:location",
      name: "home",
      component: Weather,
      props: true,
    },
  ],
});

export default router;
