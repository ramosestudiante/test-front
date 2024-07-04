import { createRouter, createWebHistory } from "vue-router";
import cookie from "../utils/helpers/cookie.handler";
import Dashboard from "../Pages/Dashboard.vue";
import Missing from "../Components/pageError/missing.vue";
import Login from "../Pages/Auth/Login.vue";
import Register from "../Pages/Auth/Register.vue";
import Welcome from "../Pages/Welcome.vue";
import ShowUser from "../Pages/user/User.vue";
import Inicio from "../Pages/user/Inicio.vue";

const defaultTitle = "Test Laravel Vue";

const routes = [
  // ERROR 404
  {
    path: "/:pathMatch(.*)*",
    name: "Missing",
    component: Missing,
    meta: {
      authRequired: false,
    },
  },

  // Inicio de sesión
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      authRequired: false,
      title: defaultTitle,
    },
  },

  // Registro
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      authRequired: false,
      title: defaultTitle,
    },
  },

  // Página de bienvenida
  {
    path: "/",
    name: "Welcome",
    component: Welcome,
    meta: {
      authRequired: false,
    },
  },
  
  // Rutas principales protegidas
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      authRequired: true,
      visible_for_role: ["admin", "user"],
      title: defaultTitle,
    },
    redirect: { name: "users" },
    children: [
      {
        path: "users",
        name: "users",
        component: Inicio,
        meta: {
          authRequired: true,
          title: defaultTitle,
        },
      },
      {
        path: "users/:id",
        name: "show",
        component: ShowUser,
        meta: {
          authRequired: true,
          title: defaultTitle,
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = cookie().getAccessToken();
  const requiresAuth = to.matched.some(record => record.meta.authRequired);

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Login' }); // Redirect to login if not authenticated
  } else if (!requiresAuth && isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    next({ name: 'Dashboard' }); // Redirect to dashboard if authenticated and trying to access login or register
  } else {
    next(); // Allow normal navigation
  }
});

export default router;
