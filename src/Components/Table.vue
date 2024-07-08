<template>
  <div>
    <div class="flex items-center justify-between">
      <!-- Search -->
      <div class="flex items-center">
        <label for="searchInput" class="mr-2">Buscar:</label>
        <input
          id="searchInput"
          type="text"
          v-model="localSearchQuery"
          placeholder="Search..."
          class="border rounded-lg py-2 px-4"
          style="max-width: 10rem"
        />
      </div>
      <!-- Button Create User -->
      <button
        class="text-red-500"
        @click="create()"
        v-if="typeUser === 'Admin'"
      >
        <svg
          class="w-[43px] h-[43px] text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fill-rule="evenodd"
            d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <!-- Create User -->
      <Modal :show="modalShow" maxWidth="2xl" @close="modalShow = false">
        <template #default>
          <div class="px-4 py-3 bg-gray-100 text-right">
            <button
              @click="onClose"
              class="text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              X
            </button>
          </div>
          <div class="p-4">
            <!-- Modal Update and Create User -->
            <modal-update
              :currentPage="currentPage"
              :modalTitle="''"
              :modalContent="''"
              :type="'create'"
              :onClose="onClose"
            />
          </div>
        </template>
      </Modal>
    </div>

    <div v-if="loading" class="flex items-center justify-center my-4">
      <svg
        class="animate-spin h-5 w-5 mr-3 text-indigo-500"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.004 8.004 0 014 12H0c0 6.627 5.373 12 12 12v-4c-3.313 0-6.243-1.343-8.438-3.509l1.438-1.438z"
        ></path>
      </svg>
      <span>Cargando...</span>
    </div>
    <table
      v-if="!loading && users?.length !== 0"
      class="min-w-full divide-y divide-gray-200 mt-10"
    >
      <thead v-if="typeUser === 'User'">
        <tr class="bg-gray-50">
          <th
            v-for="column in columns"
            :key="column"
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ column }}
          </th>
        </tr>
      </thead>
      <thead v-if="typeUser === 'Admin'">
        <tr class="bg-gray-50">
          <th
            v-for="column in columnsAdmin"
            :key="column"
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ column }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="user in users" :key="user.id">
          <td
            v-for="(field, index) in fields"
            :key="index"
            class="px-6 py-4 whitespace-nowrap"
          >
            <div class="text-sm text-gray-900">
              {{ user[field] }}
              <slot
                name="tools"
                :currentPage="currentPage"
                :tableData="user"
                v-if="field === 'tools' && typeUser === 'Admin'"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="!loading && users?.length === 0"
      class="text-center mt-4 text-gray-500"
    >
      No se encontraron datos.
    </div>

    <Pagination
      v-if="!loading && users?.length !== 0"
      :totalPages="totalPages"
      :currentPage="currentPage"
      @update:currentPage="onPageChange"
    />
  </div>
</template>

<script setup>
import Pagination from "./user/Pagination.vue";
import { ref, computed, watch } from "vue";
import dayjs from "dayjs";
import { GET_TYPE_LOGGED } from "../store/types";
import { useStore } from "vuex";
import ModalUpdate from "./user/ModalUpdate.vue";
import Modal from "./Modal.vue";
import PaginationVue from "./user/Pagination.vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
  tableData: Object,
  searchQuery: String,
  loading: Boolean,
});

const store = useStore();
const typeUser = computed(() => store.getters[GET_TYPE_LOGGED]);
const emit = defineEmits(["updatePage", "update:searchQuery"]);
const currentPage = ref(1);
const route = useRoute();
const router = useRouter();
const localSearchQuery = ref(props.searchQuery);

const columns = ["Nombre", "Email", "Rut", "Fecha de Nacimiento", "Dirección"];
const columnsAdmin = [
  "Nombre",
  "Email",
  "Rut",
  "Fecha de Nacimiento",
  "Dirección",
  "Herramientas",
];

const fields = ["name", "email", "rut", "birthday", "address", "tools"];

const users = computed(() => {
  return props.tableData?.data?.map((e, i) => ({
    key: i,
    id: e.id,
    name: e.name,
    email: e.email,
    rut: e.rut,
    birthday: dayjs(e.birthday).format("YYYY/MM/DD"),
    address: e.address,
    role_id: e.role_id,
  }));
});

const totalPages = computed(() => {
  const totalUsers = props.tableData?.total || 0;
  const usersPerPage = props.tableData?.per_page || 10;
  return Math.ceil(totalUsers / usersPerPage);
});

const onPageChange = (newPage) => {
  currentPage.value = newPage;
  const query = { ...route?.query };
  query.page = newPage;
  router.push({ path: route.path, query });
};

watch(currentPage, (newPage) => emit("updatePage", newPage));

watch(localSearchQuery, (newValue) => {
  emit("update:searchQuery", newValue);
  const query = { ...route?.query };
  query.search = newValue; // update  paráms 'search' query
  if (newValue) {
    query.search = newValue;
    if (query.page) {
      delete query.page; // Remove page parameter if it exists
    }
    router.push({ path: route.path, query });
  } else {
    const { search, ...restQuery } = query;
    router.push({ path: route.path, query: restQuery });
  }
});

const modalShow = ref(false);
const create = () => {
  modalShow.value = true;
};
const onClose = () => {
  modalShow.value = false;
};
</script>
