<template>
  <RouterLink
    :to="href"
    class="block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
  >
    <slot />
  </RouterLink>
</template>

<script setup>
import { RouterLink } from "vue-router";

defineProps({
  href: {
    type: String,
    required: true,
  },
});
</script>
