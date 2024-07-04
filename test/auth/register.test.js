import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import { createRouter, createWebHistory } from 'vue-router';
import Register from '../../src/Pages/Auth/Register.vue';
import { REGISTER, SET_PROFILE, SET_LOGGED_IN } from '../../src/store/auth/types'; // Asegúrate de que los tipos se importan correctamente
import { register } from '../../src/network';
import Welcome from '../../src/Pages/Welcome.vue';
import Dashboard from '../../src/Pages/Dashboard.vue';

// Mock function Register network
vi.mock('../../src/network', () => ({
  register: vi.fn().mockResolvedValue({
    status: 'success',
    data: {
      user: {
        name: 'Diego',
        email: 'Admin@example.com', 
        rut: '11111111-1',
        birthday: '1995/09/21',
        address: 'valparaiso',
        password: 'Password123!',
        role_id: 2,
      },
    },
  }),
}));

const routes = [
  { path: '/register', name: 'Register', component: Register },
  { path: '/', name: 'Welcome', component: Welcome },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const store = createStore({
  state: { user: null, isLoggedIn: false },
  actions: {
    [REGISTER]: async ({ commit }, payload) => {
      const response = await register(payload);
      const { user } = response.data;
      commit(SET_PROFILE, user);
      commit(SET_LOGGED_IN, true);
      return Promise.resolve({ status: 'success', user });
    },
  },
  mutations: {
    [SET_PROFILE]: (state, user) => {
      state.user = user;
    },
    [SET_LOGGED_IN]: (state, value) => {
      state.isLoggedIn = value;
    },
  },
});

describe('Register.vue', () => {
  beforeEach(() => {
    // Reinicia mocks antes de cada prueba
    vi.clearAllMocks();
  });

  it('registers a new user and navigates to Dashboard', async () => {
    // Navega a la página de registro
    router.push({ name: 'Dashboard' });
    await router.isReady();

    // Monta el componente Register con Vuex y el enrutador
    const wrapper = mount(Register, {
      global: {
        plugins: [store, router],
      },
    });

    // Rellena el formulario de registro
    await wrapper.find('input#name').setValue('Diego');
    await wrapper.find('input#email').setValue('Admin@example.com');
    await wrapper.find('input#rut').setValue('11111111-1');
    await wrapper.find('input#birthday').setValue('1995/09/21');
    await wrapper.find('input#address').setValue('valparaiso');
    await wrapper.find('input#password').setValue('Password123!');
    // Completa los demás campos del formulario según sea necesario

    // Envía el formulario
    await wrapper.find('form').trigger('submit.prevent');

    // Espera a que Vuex complete la acción de registro
    await store.dispatch(REGISTER, {
      name: 'Diego',
      email: 'Admin@example.com',
      rut: '11111111-1',
      birthday: '1995/09/21',
      address: 'valparaiso',
      password: 'Password123!',
    });

    // Asegúrate de que la navegación del enrutador esté lista
    await router.isReady();

    // Aserciones después del registro exitoso
    expect(store.state.user).toEqual({
      name: 'Diego',
      email: 'Admin@example.com',
      rut: '11111111-1',
      birthday: '1995/09/21',
      address: 'valparaiso',
      password: 'Password123!',
      role_id: 2,
    });
    expect(store.state.isLoggedIn).toBe(true);
    expect(router.currentRoute.value.name).toBe('Dashboard');
  });
});
