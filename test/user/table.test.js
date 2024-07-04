import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import { createRouter, createWebHistory } from 'vue-router';
import Inicio from '../../src/Pages/user/Inicio.vue';
import { FETCH_USERS, SET_USERS, GET_USERS, GET_TYPE_LOGGED } from '../../src/store/types';
import { allUser } from '../../src/network';
import Welcome from '../../src/Pages/Welcome.vue';

// Mock network function
vi.mock('../../src/network', () => ({
  allUser: vi.fn().mockResolvedValue({
    status: 'success',
    data: {
      users: [
        { id: 1, name: 'User 1', email: 'user1@example.com',rut:'11111111-1',address:'valparaiso',birthday:'21/09/1995' },
        { id: 2, name: 'User 2', email: 'user2@example.com',rut:'11111111-1',address:'valparaiso',birthday:'21/09/1995' },
        { id: 3, name: 'User 3', email: 'user3@example.com',rut:'11111111-1',address:'valparaiso',birthday:'21/09/1995' },
        { id: 4, name: 'User 4', email: 'user4@example.com',rut:'11111111-1',address:'valparaiso',birthday:'21/09/1995' },
        { id: 5, name: 'User 5', email: 'user5@example.com',rut:'11111111-1',address:'valparaiso',birthday:'21/09/1995' },
        { id: 6, name: 'User 6', email: 'user6@example.com',rut:'11111111-1',address:'valparaiso',birthday:'21/09/1995' },
        { id: 7, name: 'User 7', email: 'user7@example.com',rut:'11111111-1',address:'valparaiso',birthday:'21/09/1995' },
        { id: 8, name: 'User 8', email: 'user8@example.com',rut:'11111111-1',address:'valparaiso',birthday:'21/09/1995' },
        { id: 9, name: 'User 9', email: 'user9@example.com',rut:'11111111-1',address:'valparaiso',birthday:'21/09/1995' },
        { id: 10, name: 'User 10', email: 'user10@example.com',rut:'11111111-1',address:'valparaiso',birthday:'21/09/1995' },
      ],
      total: 10,
    },
  }),
}));

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Welcome', component: Welcome },
    { path: '/users', name: 'users', component: Inicio },
  ],
});

const store = createStore({
  state: {
    users: [],
    typeUser: 'admin',
  },
  getters: {
    [GET_USERS]: (state) => state.users,
    [GET_TYPE_LOGGED]: (state) => state.typeUser,
  },
  mutations: {
    [SET_USERS](state, users) {
      state.users = users;
    },
  },
  actions: {
    async [FETCH_USERS]({ commit }, payload) {
      try {
        const response = await allUser(payload);
        commit(SET_USERS, response.data.users);
        return Promise.resolve(response.data); // Return response.data instead of response.data.users
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
  },
});

describe('Dashboard.vue', () => {
  it('obtains users correctly', async () => {
    const wrapper = mount(Inicio, {
      global: {
        plugins: [store, router],
      },
    });

    // Simulate loading users
    const resp =  await store.dispatch(FETCH_USERS, { page: 1, per_page: 10 });
    await wrapper.vm.$nextTick();

    // Ensure FETCH_USERS was called with correct parameters
    expect(allUser).toHaveBeenCalledWith({
      page: 1,
      per_page: 10,
    });

    // Ensure store state was updated correctly
    expect(store.state.users).toEqual(resp.users);
  });
});
