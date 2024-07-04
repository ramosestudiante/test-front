import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import { createRouter, createWebHistory } from 'vue-router';
import Login from '../../src/Pages/Auth/Login.vue';
import Dashboard from '../../src/Pages/Dashboard.vue';
import Welcome from '../../src/Pages/Welcome.vue';
import Register from '../../src/Pages/Auth/Register.vue';
import { LOG_IN, SET_PROFILE, SET_LOGGED_IN } from '../../src/store/auth/types';
import { login } from '../../src/network';

// Mock function Login network
vi.mock('../../src/network', () => ({
  login: vi.fn().mockResolvedValue({
    status: 'success',
    data: {
      user: {
        email: 'Admin@example.com',
        password:'Password123!'
        // Otros datos de usuario simulados
      },
      token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzE5OTY4MzgxLCJleHAiOjE3MTk5NzE5ODEsIm5iZiI6MTcxOTk2ODM4MSwianRpIjoiVVd2ZnZzM085N1dzR3VVeCIsInN1YiI6IjEiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3Iiwicm9sZSI6IkFkbWluIn0.MnMIOdnMvfoOnm9F1og32nF0rCFrNqV3rWItP_FKgfM', // Token
    },
  }),
}));


const routes = [
  { path: '/', name: 'Welcome', component: Welcome },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard},
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

const store = createStore({
  state: { user: null, isLoggedIn: false },
  actions: {
    [LOG_IN]: async ({ commit }, payload) => {
      const response = await login(payload);
      const { user, token } = response.data.user;
      commit(SET_PROFILE, response.data.user);
      commit(SET_LOGGED_IN, true);
      return Promise.resolve({ status: 'success', user, token });
    },
},


  mutations: {
    [SET_PROFILE]: (state, user) => { state.user = user; },
    [SET_LOGGED_IN]: (state, value) => { state.isLoggedIn = value; },
  },
});

describe('Login.vue', () => {
  it('logs in a user and navigates to Dashboard', async () => {
    // Simula la navegación a la página de inicio de sesión
    router.push({name:'Dashboard'});
    await router.isReady(); // Espera a que la navegación del enrutador esté completa

    // Monta el componente Login con Vuex y el enrutador
    const wrapper = mount(Login, {
      global: {
        plugins: [store, router],
      },
    });

    // Llena el formulario de inicio de sesión
    await wrapper.find('input#email').setValue('Admin@example.com');
    await wrapper.find('input#password').setValue('Password123!');
    await wrapper.find('form').trigger('submit.prevent');

    // Espera a que se complete la acción de inicio de sesión en Vuex
    await store.dispatch(LOG_IN);

    // Espera a que Vue actualice
    await wrapper.vm.$nextTick();

    // Asegúrate de que la navegación del enrutador esté lista
    await router.isReady();

    // Aserción de estado Vuex después de iniciar sesión
    expect(store.state.user).toEqual({ email: 'Admin@example.com', password:'Password123!' });
    expect(store.state.isLoggedIn).toBe(true);

    // Asegúrate de que la navegación se redirige al Dashboard
    expect(router.currentRoute.value.name).toBe('Dashboard');
  });
});

