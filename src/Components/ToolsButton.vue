<template>
  <div>
    <button class="text-black-500 mr-2" @click="showUser(tableData)">
      <svg
        class="w-6 h-6 text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          stroke-width="2"
          d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
        />
        <path
          stroke="currentColor"
          stroke-width="2"
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    </button>
    <button class="text-blue-500 mr-2" @click="editUser(tableData)">
      <svg
        class="w-6 h-6 text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          fill-rule="evenodd"
          d="M5 8a4 4 0 1 1 7.796 1.263l-2.533 2.534A4 4 0 0 1 5 8Zm4.06 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h2.172a2.999 2.999 0 0 1-.114-1.588l.674-3.372a3 3 0 0 1 .82-1.533L9.06 13Zm9.032-5a2.907 2.907 0 0 0-2.056.852L9.967 14.92a1 1 0 0 0-.273.51l-.675 3.373a1 1 0 0 0 1.177 1.177l3.372-.675a1 1 0 0 0 .511-.273l6.07-6.07a2.91 2.91 0 0 0-.944-4.742A2.907 2.907 0 0 0 18.092 8Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <button class="text-red-500" @click="deleteUser(tableData)">
      <svg
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        width="24"
        version="1.1"
        xmlns:cc="http://creativecommons.org/ns#"
        xmlns:dc="http://purl.org/dc/elements/1.1/"
      >
        <g transform="translate(0 -1028.4)">
          <path
            d="m22 12c0 5.523-4.477 10-10 10-5.5228 0-10-4.477-10-10 0-5.5228 4.4772-10 10-10 5.523 0 10 4.4772 10 10z"
            transform="translate(0 1029.4)"
            fill="#c0392b"
          ></path>
          <path
            d="m22 12c0 5.523-4.477 10-10 10-5.5228 0-10-4.477-10-10 0-5.5228 4.4772-10 10-10 5.523 0 10 4.4772 10 10z"
            transform="translate(0 1028.4)"
            fill="#e74c3c"
          ></path>
          <rect height="4" width="12" y="1039.4" x="6" fill="#c0392b"></rect>
          <rect height="3" width="12" y="1039.4" x="6" fill="#ecf0f1"></rect>
        </g>
      </svg>
    </button>

    <Modal :show="modalShow" maxWidth="2xl" @close="modalShow = false">
      <template #default>
        <div class="px-4 py-3 bg-gray-100 text-right">
          <button
            @click="closeModal"
            class="text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            X
          </button>
        </div>
        <div class="p-4">
          <modal-update
            v-if="modalTitle === 'Editar usuario'"
            :onClose="closeModal"
            :modalTitle="modalTitle"
            :modalContent="modalContent"
            :tableData="tableData"
            :currentPage="currentPage || 1"
            :type="'update'"
          />
          <modal-delete
            v-if="modalTitle === 'Confirmar eliminación'"
            :onClose="closeModal"
            :tableData="tableData"
            :modalTitle="modalTitle"
            :currentPage="currentPage || 1"
            :modalContent="modalContent"
          />
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Modal from "./Modal.vue";
import ModalUpdate from "./user/ModalUpdate.vue";
import ModalDelete from "./user/ModalDelete.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  tableData: {
    type: Object,
    required: true,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
});

const modalShow = ref(false);
const modalTitle = ref("");
const modalContent = ref("");

const showUser = (user) => {
  modalTitle.value = "Detalles del usuario";
  router.push({ name: "show", params: { id: user.id } });
  modalShow.value = true;
};

const editUser = (user) => {
  modalTitle.value = "Editar usuario";
  modalShow.value = true;
};

const deleteUser = (user) => {
  modalTitle.value = "Confirmar eliminación";
  modalContent.value = `¿Estás seguro de eliminar a ${user.name}?`;
  modalShow.value = true;
};

const closeModal = () => {
  modalShow.value = false;
};
</script>
