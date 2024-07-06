<template>
  <div class="flex justify-center items-center">
    <div
      class="bg-white border-4 border-white p-6 rounded-lg shadow-xl w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-[42rem]"
    >
      <div
        class="mb-6 bg-white rounded-lg overflow-hidden shadow-xl transform transition-all"
      >
        <h2 class="text-lg font-bold mb-2">Detalle Usuario</h2>
        <form @submit.prevent="formupdate">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700"
              >Name</label
            >
            <input
              id="name"
              type="text"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="form.name"
              disabled
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"
              >Correo electronico</label
            >
            <input
              id="email"
              type="text"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="form.email"
              disabled
            />
          </div>
          <div>
            <label for="rut" class="block text-sm font-medium text-gray-700"
              >Rut</label
            >
            <input
              id="rut"
              type="text"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="form.rut"
              disabled
            />
          </div>

          <div>
            <label
              for="birthday"
              class="block text-sm font-medium text-gray-700"
              >Fecha de Nacimiento</label
            >
            <input
              id="birthday"
              type="date"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="form.birthday"
              disabled
            />
          </div>
          <div>
            <label for="address" class="block text-sm font-medium text-gray-700"
              >Direccion</label
            >
            <input
              id="address"
              type="text"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="form.address"
              disabled
            />
          </div>
          <div>
            <label
              for="typeuser"
              class="block text-sm font-medium text-gray-700"
            >
              Tipo usuario
            </label>
            <input
              id="typeuser"
              type="text"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="form.typeuser"
              disabled
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { SHOW_USER, GET_USER, GET_TYPE_LOGGED } from "../../store/types";

const store = useStore();
const route = useRoute();

const mapRoleIdToUserType = (roleId) => {
  return roleId == 1 ? "Admin" : roleId == 2 ? "User" : "";
};
const user = computed(() => store.getters[GET_USER]);

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const form = ref({
  name: user.value?.name,
  email: user.value?.email,
  rut: user.value?.rut,
  birthday: user.value?.birthday ? formatDate(user.value?.birthday) : "",
  address: user.value?.address,
  typeuser: mapRoleIdToUserType(user.value?.role_id),
});
const id = computed(() => route.params.id);

onMounted(async () => {
  await store.dispatch(SHOW_USER, id.value);
  const userData = store.getters[GET_USER];
  form.value.name = userData?.name;
  form.value.email = userData?.email;
  form.value.rut = userData?.rut;
  form.value.birthday = userData?.birthday
    ? formatDate(userData?.birthday)
    : "";
  form.value.address = userData?.address;
  form.value.typeuser = mapRoleIdToUserType(userData?.role_id);
});
</script>
