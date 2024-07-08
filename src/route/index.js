import { createRouter, createWebHistory } from "vue-router";
import cookieHandler from "../utils/helpers/cookie.handler";
import Dashboard from "../Pages/Dashboard.vue";
import Missing from "../Components/pageError/missing.vue";
import Login from "../Pages/Auth/Login.vue";
import Register from "../Pages/Auth/Register.vue";
import Welcome from "../Pages/Welcome.vue";
import ShowUser from "../Pages/user/User.vue";
import Inicio from "../Pages/user/Inicio.vue";
import Maintenance from '../Components/pageError/mantencion.vue';

const defaultTitle = "Test Laravel Vue";

const routes = [
  {
    path: "/:pathMatch(.*)*",
    name: "Missing",
    component: Missing,
    meta: {
      authRequired: false,
    },
  },
  {
    path: "/mantencion",
    name: "Maintenance",
    component: Maintenance,
    meta: {
      authRequired: false,
    }, 
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      authRequired: false,
      title: defaultTitle,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      authRequired: false,
      title: defaultTitle,
    },
  },
  {
    path: "/",
    name: "Welcome",
    component: Welcome,
    meta: {
      authRequired: false,
    },
  },
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
  const isAuthenticated = !!cookieHandler().getAccessToken();
  const requiresAuth = to.matched.some(record => record.meta.authRequired);

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });
  } else if (!requiresAuth && isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;
