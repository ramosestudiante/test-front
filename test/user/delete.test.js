import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import DeleteModal from '../../src/Components/user/ModalDelete.vue'; // Ajusta la ruta según tu estructura
import Welcome from '../../src/Pages/Welcome.vue';
import { deleteUser } from '../../src/network';
import { DELETE_USER, FETCH_USERS } from '../../src/store/types';
import { createRouter, createWebHistory } from 'vue-router';
import { createStore } from 'vuex';

// Mock network function
vi.mock('../../src/network', () => ({
  deleteUser: vi.fn().mockResolvedValue({
    status: 'success',
    data: {
      user: { id: 1, name: 'User 1', email: 'user1@example.com',rut:'11111111-1',address:'valparaiso',birthday:'21/09/1995' },
    },
  }),
}));

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Welcome', component: Welcome },
    { path: '/dashboard', name: 'Dashboard', component: DeleteModal },
  ],
});

const store = createStore({
  state: {
    users: [],
    user: null,
    typeUser: 'admin',
  },
  mutations: {},
  actions: {
    async [DELETE_USER]({ commit }, payload) {
      try {
        const response = await deleteUser(payload);
        return Promise.resolve(response.data.user);
      } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
      }
    },
    async [FETCH_USERS]({ commit }, payload) {
      return Promise.resolve(payload); // Replace with actual implementation as needed
    },
  },
});

// Custom flushPromises function
const flushPromises = () => {
  return new Promise(resolve => setTimeout(resolve, 0));
}

describe('DeleteModal.vue', () => {
  it('emits onClose when cancel button is clicked', async () => {
    const onClose = vi.fn();
    const wrapper = mount(DeleteModal, {
      props: {
        modalTitle: 'Delete User',
        onClose,
        modalContent: 'Are you sure you want to delete this user?',
        tableData: { id: 1, name: 'User 1', email: 'user1@example.com' },
        currentPage: 1,
      },
      global: {
        plugins: [store, router],
      },
    });

    await wrapper.vm.$nextTick();

    const cancelButton = wrapper.find('button[text="Cancelar"]');
    if (!cancelButton.exists()) {
      console.log(wrapper.html());
      throw new Error('Cancel button not found.');
    }

    await cancelButton.trigger('click');

    expect(onClose).toHaveBeenCalled();
  });

  it('calls DELETE_USER and FETCH_USERS actions when confirm button is clicked', async () => {
    const onClose = vi.fn();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const wrapper = mount(DeleteModal, {
      props: {
        modalTitle: 'Delete User',
        onClose,
        modalContent: 'Are you sure you want to delete this user?',
        tableData: { id: 1, name: 'User 1', email: 'user1@example.com' },
        currentPage: 1,
      },
      global: {
        plugins: [store, router],
      },
    });

    await wrapper.vm.$nextTick();

    const deleteButton = wrapper.find('button[text="Eliminar"]');
    if (!deleteButton.exists()) {
      throw new Error('Delete button not found.');
    }

    await deleteButton.trigger('click');

    expect(wrapper.vm.loading).toBe(true);

    await flushPromises();

    expect(wrapper.vm.loading).toBe(false);
    expect(onClose).toHaveBeenCalled();

    // Ensure store.dispatch calls are properly asserted
    expect(dispatchSpy).toHaveBeenCalledWith(DELETE_USER, { id: 1 });
    expect(dispatchSpy).toHaveBeenCalledWith(FETCH_USERS, { page: 1, per_page: 10 });

    dispatchSpy.mockRestore(); // Restore the original dispatch function
  });
});
