<template>
  <head title="Dashboard" />

  <AuthenticatedLayout>
    <template #content>
      <div class="py-12">
        <div class="max-w mx-auto sm:px-6 lg:px-8">
          <div
            class="bg-white max-w mx-auto h-auto overflow-hidden shadow-sm sm:rounded-lg"
          >
            <div class="p-6 text-gray-900">
              <!-- content within the dashboard -->
              <router-view />
            </div>
          </div>
        </div>
      </div>
    </template>
  </AuthenticatedLayout>
</template>

<script setup>
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout.vue";
</script>
