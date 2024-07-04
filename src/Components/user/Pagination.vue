<template>
    <div class="flex justify-center items-center space-x-2">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
      </button>
  
      <button
        v-for="page in pages"
        :key="page"
        @click="goToPage(page)"
        :class="{
          'bg-blue-500 text-white': currentPage === page,
          'bg-gray-200': currentPage !== page
        }"
        class="px-3 py-1 rounded"
      >
        {{ page }}
      </button>
  
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      totalPages: {
        type: Number,
        required: true,
      },
      currentPage: {
        type: Number,
        required: true,
      }
    },
    computed: {
      pages() {
        const range = [];
        const start = Math.max(1, this.currentPage - 5);
        const end = Math.min(this.totalPages, this.currentPage + 4);
  
        for (let i = start; i <= end; i++) {
          range.push(i);
        }
        return range;
      }
    },
    methods: {
      prevPage() {
        if (this.currentPage > 1) {
          this.$emit('update:currentPage', this.currentPage - 1);
        }
      },
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.$emit('update:currentPage', this.currentPage + 1);
        }
      },
      goToPage(page) {
        this.$emit('update:currentPage', page);
      }
    }
  };
  </script>
  