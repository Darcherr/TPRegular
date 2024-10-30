import {
    createRouter,
    createWebHistory,
    RouteLocationNormalized,
    RouterView
  } from "vue-router";
 
  
  const routes = [
    {
      path: "/",
      name: "shell",
      component: Shell,
      redirect: "/home",
      children: [
        { path: "/home", name: "home", component: Home },
    { path: "/login", name: "login", component: Login },
    { path: "/:catchAll(.*)", redirect: "/" },
  ]}];
  
  const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
      return Promise.resolve({ left: 0, top: 0 });
    },
  });
  
  router.beforeEach((to: RouteLocationNormalized) => {
    const isAuthenticated = localStorage.getItem("auth_token");
  
    if (to.name == "login" && isAuthenticated) {
      return { name: "shell" };
    }
  
    if (to.name != "login" && !isAuthenticated) {
      return { name: "login" };
    }
  });
  
  export default router;
  