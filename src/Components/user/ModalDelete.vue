<template>
  <div class="">
    <h1 class="text-lg font-bold mb-2">
      {{ modalContent }}
    </h1>
    <div class=""></div>
    <div class="flex justify-end space-x-2">
      <button
        text="Cancelar"
        @click="cancelDelete"
        :disabled="loading"
        class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none"
      >
        Cancelar
      </button>
      <button
      text="Eliminar"
        @click="confirmDelete"
        :class="{ 'opacity-25': loading }"
        :disabled="loading"
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
      >
        Eliminar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { DELETE_USER, FETCH_USERS } from "../../store/types";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

const store = useStore();
const props = defineProps({
  modalTitle: {
    type: String,
    required: true,
  },
  tableData: {
    type: Object,
  },
  onClose: {
    type: Function,
    required: true,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  modalContent: {
    type: String,
  },
});
const loading = ref(false);
const router = useRouter();
const route = useRoute();

const cancelDelete = () => {
  props.onClose();
};
const confirmDelete = async () => {
  loading.value = true;
  try {
    const userId = {
      id: props.tableData.id,
    };

    await store.dispatch(DELETE_USER, userId);
    const resp = await store.dispatch(FETCH_USERS, {
      page: props.currentPage,
      per_page: 10,
    });
if (resp.data.length === 0 && props.currentPage > 1) {
    router.push({ path: route.path, query: { page: props.currentPage - 1 } });
    }

    loading.value = false;
    props.onClose();
  } catch (error) {
    console.log("Error al eliminar usuario:", error);
    loading.value = false;
  }
};
</script>

<style scoped></style>
