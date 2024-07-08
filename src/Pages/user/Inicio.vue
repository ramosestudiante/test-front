<template>
  <div>
    <Table-user
      :tableData="users"
      :typeUser="typeUser"
      @updatePage="updateCurrentPage"
      @update:searchQuery="updateSearchQuery"
      :loading="loading"
    >
      <template v-slot:create="{}">
        <ToolsButton
          :tableData="tableData"
          :showUser="showUser"
          :editUser="editUser"
          :deleteUser="deleteUser"
          :currentPage="currentPage"
        />
      </template>
      <template v-slot:tools="{ tableData, showUser, editUser, deleteUser }">
        <ToolsButton
          :tableData="tableData"
          :showUser="showUser"
          :editUser="editUser"
          :deleteUser="deleteUser"
          :currentPage="currentPage"
        />
      </template>
    </Table-user>
  </div>
</template>

<script setup>
import TableUser from "../../Components/Table.vue";
import ToolsButton from "../../Components/ToolsButton.vue";
import { ref } from "vue";
import { computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { FETCH_USERS, GET_USERS, GET_TYPE_LOGGED } from "../../store/types";
import { useRoute, useRouter } from "vue-router";
import debounce from "lodash/debounce";

const store = useStore();
const users = computed(() => store.getters[GET_USERS]);
const typeUser = computed(() => store.getters[GET_TYPE_LOGGED]);
const searchQuery = ref("");
const route = useRoute();
const currentPage = ref(route.query?.page ? route.query?.page : 1);
const router = useRouter();
const loading = ref(false);

let timeoutId = null;

const loadUsers = async () => {
  loading.value = true;
  try {
    setTimeout(async () => {
      const perPage = 10;
      const query = { ...route?.query };

      if (searchQuery.value !== "") {
        await store.dispatch(FETCH_USERS, {
          search: searchQuery.value,
        });

        // Update the query with the search parameter
        query.search = searchQuery.value;
        // Remove page params if it exists
        if (query.page) {
          delete query.page;
        }
        router.push({ path: route.path, query });
      } else {
        await store.dispatch(FETCH_USERS, {
          page: currentPage.value,
          per_page: perPage,
        });

        // Update the query params
        query.page = currentPage.value;
        // Remove the search params if it exists
        if (query.search) {
          delete query.search;
        }
        router.push({ path: route.path, query });
      }
      loading.value = false;
    }, 600);
  } catch (error) {
    loading.value = false;
    console.log(error);
  }
};

const debouncedLoadUsers = debounce(() => {
  loadUsers();
}, 500);

const updateSearchQuery = (query) => {
  searchQuery.value = query;
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    debouncedLoadUsers();
  }, 500);
};

const updateCurrentPage = async (newPage) => {
  currentPage.value = newPage;
  loadUsers();
};

watch(currentPage, () => {
  loadUsers();
});

onMounted(() => {
  if (route.query.page) {
    currentPage.value = parseInt(route.query.page);
  }
  loadUsers();
});
</script>
