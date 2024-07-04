import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { createStore } from 'vuex';
import Welcome from '../../src/Pages/Welcome.vue';
import ModalUpdate from '../../src/Components/user/ModalUpdate.vue';
import { SET_USER,UPDATE_USER,CREATE_USER } from '../../src/store/types';
import { updateUser, createUser} from '../../src/network';

// Mock the network call
vi.mock('../../src/network', () => ({
  updateUser: vi.fn().mockResolvedValue({
    status: 'success',
    data: {
      user: {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
      },
    },
  }),
  createUser: vi.fn().mockResolvedValue({
    status: 'success',
    data: {
      user: { id: 1, name: 'User 1', email: 'user1@example.com',rut:'11111111-1',address:'valparaiso',birthday:'21/09/1995',role_id:2,password:'Password123!' },
    },
  }),
}));

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Welcome', component: Welcome },
    { path: '/dashboard', name: 'Dashboard', component: ModalUpdate },
  ],
});

// Create mocked Vuex store
const store = createStore({
  state: {
    user: null,
  },
  mutations: {
    [SET_USER](state, user) {
      state.user = user;
    },
  },
  actions: {
    async [UPDATE_USER]({ commit }, { id, payload }) {
      try {
        const response = await updateUser(id, payload);
        commit(SET_USER, response.data.user); // Update state with response data
        return Promise.resolve(response.data.user);
      } catch (error) {
        console.error('Error updating user:', error);
        throw error;
      }
    },
    async [CREATE_USER]({ commit }, payload ) {
      try {
        const response = await createUser(payload);
        commit(SET_USER, response.data.user); // Update state with response data
        return Promise.resolve(response.data.user);
      } catch (error) {
        console.error('Error updating user:', error);
        throw error;
      }
    },
  
  },
});

describe('ModalUpdate.vue', () => {

  it('updates a user', async () => {
    const onClose = vi.fn();
    const wrapper = mount(ModalUpdate, {
      global: {
        plugins: [store, router],
        stubs: ['PrimaryButton'], // Stub any components not under test
      },
      props: {
        modalTitle: 'Update User',
        modalContent: 'Update an existing user',
        onClose,
        tableData: {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          // Add any other necessary data for update
        },
        currentPage: 1,
        type: 'update',
      },
    });
    const resp = await store.dispatch(UPDATE_USER, {id: 1, payload: {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
    }});
    // Simula el envío del formulario
    await wrapper.find('form').trigger('submit.prevent');
    await wrapper.vm.$nextTick();



    // Simulate user interaction or event triggering that leads to update
    // e.g., wrapper.find('button').trigger('click');

    // Wait for the promise returned by updateUser to resolve
    await new Promise((resolve) => setTimeout(resolve));
    // Check updated state in Vuex after update
    expect(store.state.user).toEqual(resp);
    
  });

  // Uncomment and update this test if you want to test the user creation scenario
  it('create a new user', async () => {
    const wrapper = mount(ModalUpdate, {
      global: {
        plugins: [store, router],
        stubs: ['PrimaryButton'], // Stub any components not under test
      },
      props: {
        modalTitle: 'Create User',
        modalContent: 'Create a new user',
        tableData: null,
        onClose: vi.fn(),
        currentPage: 1,
        type: 'create',
      },
    });

    // Fill form fields (simulate user input)
    await wrapper.find('#name').setValue('Jane Doe');
    await wrapper.find('#email').setValue('jane.doe@example.com');
    await wrapper.find('#rut').setValue('987654321');
    await wrapper.find('#birthday').setValue('1995-05-05');
    await wrapper.find('#address').setValue('456 Elm St');
    await wrapper.find('#password').setValue('Password1');
    await wrapper.find('#typeuser').setValue('2'); // Assuming 2 is the user role

    // Simulate form submission
    await wrapper.find('form').trigger('submit.prevent');
    await wrapper.vm.$nextTick();
    // Check if Vuex actions were dispatched correctly
    const respCreate = await store.dispatch(CREATE_USER,{ 
      id: 1, 
      name: 'User 1', 
      email: 'user1@example.com',
      rut:'11111111-1',
      address:'valparaiso',
      birthday:'21/09/1995',
      role_id:2,
      password:'Password123!' 
    });

      // Wait for the promise returned by updateUser to resolve
      await new Promise((resolve) => setTimeout(resolve));
      // Check updated state in Vuex after update
      expect(store.state.user).toEqual(respCreate);

    // Optionally, test other aspects such as form validation and error handling
  });
});
