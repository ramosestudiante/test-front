import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DetalleUsuario from '../../src/Components/user/Detail.vue';
import { createStore } from 'vuex';
import { createRouter, createWebHistory } from 'vue-router';
import { SHOW_USER, SET_USER, GET_USER } from '../../src/store/user/types';
import { showUser } from '../../src/network';
import Welcome from '../../src/Pages/Welcome.vue';

// Mock network function
vi.mock('../../src/network', () => ({
  showUser: vi.fn().mockResolvedValue({
    status: 'success',
    data: {
      user: {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        rut: '12345678-9',
        birthday: '1990-01-01',
        address: '123 Main St',
        role_id: 2,
      },
    },
  }),
}));

// Configure Vuex store
const store = createStore({
  state() {
    return {
      user: null,
    };
  },
  getters: {
    [GET_USER]: (state) => state.user,
  },
  mutations: {
    [SET_USER](state, user) {
      state.user = user;
    },
  },
  actions: {
    async [SHOW_USER]({ commit }, id) {
      try {
        const response = await showUser(id);
        commit(SET_USER, response.data.user); // Update state with user data
        return Promise.resolve(response.data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
      }
    },
  },
});

// Configure Vue Router for the test
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Welcome },
    { path: '/user/:id', component: DetalleUsuario },
  ],
});

describe('DetalleUsuario.vue', () => {
  it('muestra correctamente los detalles del usuario', async () => {
    store.commit(SET_USER, {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      rut: '12345678-9',
      birthday: '1990-01-01',
      address: '123 Main St',
      role_id: 2,
    });

    const wrapper = mount(DetalleUsuario, {
      global: {
        plugins: [store, router],
        mocks: {
          $route: {
            params: { id: 1 },
          },
        },
      },
    });

    await router.isReady();
    await wrapper.vm.$nextTick();
    const resp = await store.dispatch(SHOW_USER, { id: 1 });
    expect(store.state.user).toEqual(resp);
  
  });
});
