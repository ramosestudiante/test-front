<template>
  <!-- CRUD table within the dashboard -->
  <Table-user
    :tableData="users"
    :typeUser="typeUser"
    @updatePage="updateCurrentPage"
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
    <!-- I pass dynamic content through slot, in this case they are buttons for the crud in the table -->
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
</template>

<script setup>
import TableUser from "../../Components/Table.vue";
import ToolsButton from "../../Components/ToolsButton.vue";
import { ref, watchEffect } from "vue";
import { computed, onMounted, reactive, watch } from "vue";
import { useStore } from "vuex";
import { FETCH_USERS, GET_USERS, GET_TYPE_LOGGED } from "../../store/types";

const store = useStore();
const users = computed(() => store.getters[GET_USERS]);
const typeUser = computed(() => store.getters[GET_TYPE_LOGGED]);
const currentPage = ref(0);

const loadUsers = async () => {
  try {
    const perPage = 10;
    const response = await store.dispatch(FETCH_USERS, {
      page: currentPage.value,
      per_page: perPage,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateCurrentPage = async (newPage) => {
  currentPage.value = newPage;
};

watchEffect(() => {
  loadUsers(currentPage.value);
});
</script>
