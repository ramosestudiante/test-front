<template>
  <div>
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-white border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                <NavLink :to="{ name: 'Dashboard' }" :active="true">
                  {{ typeUser }}
                </NavLink>
                <NavLink :to="{ name: 'Welcome' }" :active="false">
                  Inicio
                </NavLink>
              </div>
            </div>
            <div class="hidden sm:flex sm:items-center sm:ms-6">
              <div class="ms-3 relative">
                <Dropdown align="right" width="48">
                  <template #trigger>
                    <span class="inline-flex rounded-md">
                      <button
                        type="button"
                        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                      >
                        {{ user?.name }}
                        <svg
                          class="ms-2 -me-0.5 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </button>
                    </span>
                  </template>

                  <template #content>
                    <!-- <DropdownLink href=""> Profile </DropdownLink> -->
                    <DropdownLink @click="logout" href="" as="button">
                      Log Out
                    </DropdownLink>
                  </template>
                </Dropdown>
              </div>
            </div>
            <div class="-me-2 flex items-center sm:hidden">
              <button
                @click="showingNavigationDropdown = !showingNavigationDropdown"
                class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
              >
                <svg
                  class="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    :class="{
                      hidden: showingNavigationDropdown,
                      'inline-flex': !showingNavigationDropdown,
                    }"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                  <path
                    :class="{
                      hidden: !showingNavigationDropdown,
                      'inline-flex': showingNavigationDropdown,
                    }"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Responsive Navigation Menu -->
        <div
          :class="{
            block: showingNavigationDropdown,
            hidden: !showingNavigationDropdown,
          }"
          class="sm:hidden"
        >
          <div class="pt-2 pb-3 space-y-1">
            <ResponsiveNavLink href="" active=""> Dashboard </ResponsiveNavLink>
          </div>
          <div class="pt-4 pb-1 border-t border-gray-200">
            <div class="px-4">
              <div class="font-medium text-base text-gray-800"></div>
              <div class="font-medium text-sm text-gray-500"></div>
            </div>
            <div class="mt-3 space-y-1">
              <ResponsiveNavLink href=""> Profile </ResponsiveNavLink>
              <ResponsiveNavLink
                @click="logout"
                href=""
                method="post"
                as="button"
              >
                Log Out
              </ResponsiveNavLink>
            </div>
          </div>
        </div>
      </nav>

      <header class="bg-white shadow" v-if="$slots.header">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <slot name="header" />
        </div>
      </header>

      <main>
        <slot name="content" :userData="user" :typeUser="typeUser" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Dropdown from "../Components/Dropdown.vue";
import DropdownLink from "../Components/DropdownLink.vue";
import NavLink from "../Components/NavLink.vue";
import ResponsiveNavLink from "../Components/ResponsiveNavLink.vue";
import {
  FETCH_AUTH,
  GET_LOGGED_USER,
  LOG_OUT,
  GET_TYPE_LOGGED,
} from "../store/types";
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useStore();
const isLoggedIn = computed(() => store.getters[IS_LOGGED_IN]);
const user = computed(() => store.getters[GET_LOGGED_USER]);
const typeUser = computed(() => store.getters[GET_TYPE_LOGGED]);

const logout = async () => {
  try {
    await store.dispatch(LOG_OUT);
    router.push({ name: "Welcome" });
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

onMounted(async () => {
  try {
    if (isLoggedIn) {
      await store.dispatch(FETCH_AUTH);
    }
  } catch (error) {
    console.log(error);
  }
});

const showingNavigationDropdown = ref(false);
</script>
