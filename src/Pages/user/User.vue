<template>
  <button @click="goBack">
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
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M5 12h14M5 12l4-4m-4 4 4 4"
      />
    </svg>
  </button>
<!-- table user detail -->
  <Detail />
</template>

<script setup>
import { SHOW_USER } from "../../store/types";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Detail from "../../Components/user/Detail.vue";

const store = useStore();
const props = defineProps({
  tableData: {
    type: Object,
  },
});

const router = useRouter();

const goBack = () => {
  router.go(-1);
};
</script>
