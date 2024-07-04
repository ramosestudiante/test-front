<template>
  <h2 class="text-lg font-bold mb-2">
    {{ modalTitle }}
  </h2>
  <div>
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
          required
          autocomplete="name"
          placeholder="Ingresa tu nombre"
          @blur="handleBlur('name')"
          :class="{ 'border-red-500': form.touched.name && form.errors.name }"
        />
        <InputError
          class="mt-2"
          :message="form.touched.name ? form.errors.name : ''"
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
          required
          autocomplete="email"
          placeholder="Ingresa tu correo electronico"
          @blur="handleBlur('email')"
          :class="{ 'border-red-500': form.touched.email && form.errors.email }"
        />

        <InputError
          class="mt-2"
          :message="form.touched.email ? form.errors.email : ''"
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
          required
          autocomplete="rut"
          maxlength="12"
          placeholder="Ingresa tu rut"
          @blur="handleBlur('rut')"
          :class="{ 'border-red-500': form.touched.rut && form.errors.rut }"
          @keyup="formatRuts"
          @input="clearUpdateErrorMessage"
        />

        <InputError
          class="mt-2"
          :message="form.touched.rut ? form.errors.rut:''"
        />
      </div>

      <div>
        <label for="birthday" class="block text-sm font-medium text-gray-700"
          >Fecha de Nacimiento</label
        >
        <input
          id="birthday"
          type="date"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          v-model="form.birthday"
          required
          autocomplete="birthday"
          placeholder="Ingresa tu fecha de nacimiento"
          @blur="handleBlur('birthday')"
          :class="{
            'border-red-500': form.touched.birthday && form.errors.birthday,
          }"
        />

        <InputError
          class="mt-2"
          :message="form.touched.birthday ? form.errors.birthday : ''"
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
          required
          autocomplete="address"
          placeholder="Ingresa tu direccion"
          @blur="handleBlur('address')"
          :class="{
            'border-red-500': form.touched.address && form.errors.address,
          }"
        />

        <InputError
          class="mt-2"
          :message="form.touched.address ? form.errors.address : ''"
        />
      </div>

      <div class="mt-4" v-if="type == 'create'">
        <label for="address" class="block text-sm font-medium text-gray-700"
          >Contraseña</label
        >

        <div class="relative">
          <input
            id="password"
            :type="showPassword ? 'text' : 'password'"
            class="mt-1 block w-full pr-10 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            v-model="form.password"
            required
            autocomplete="new-password"
            placeholder="Ingresa una contraseña"
            @blur="handleBlur('password')"
            :class="{
              'border-red-500': form.touched.password && form.errors.password,
            }"
          />
          <button
            type="button"
            @click="togglePasswordVisibility"
            class="absolute inset-y-0 right-0 px-3 py-2 text-gray-400 focus:outline-none"
          >
            <svg
              v-if="showPassword"
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.536 8.464a4 4 0 00-5.072 5.072M3 3l18 18"
              />
            </svg>
            <svg
              v-else
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.536 8.464a4 4 0 00-5.072 5.072M3 3l18 18"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18.364 5.636a8 8 0 00-11.314 11.314M15.536 8.464L18.364 5.636M5.636 18.364L8.464 15.536"
              />
            </svg>
          </button>
        </div>

        <InputError
          class="mt-2"
          :message="form.touched.password ? form.errors.password : ''"
        />
      </div>

      <div>
        <label for="typeuser" class="block text-sm font-medium text-gray-700">
          Tipo usuario
        </label>
        <select
          id="typeuser"
          v-model="form.typeuser"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        >
          <option value="" disabled>Selecciona el tipo de usuario</option>
          <option
            v-for="option in userTypes"
            :key="option.value"
            :value="option.value"
          >
            {{ option.text }}
          </option>
        </select>
      </div>
      
      <div class="w-full flex items-center justify-between mt-10">
        <div class="flex-grow"></div>

        <PrimaryButton
          v-if="type === 'update'"
          class="ml-auto"
          :class="{
    'opacity-25': loading,
    'btn-disabled': !hasChanges
  }"
  :disabled="!hasChanges || loading"
        >
          Actualizar
        </PrimaryButton>

        <PrimaryButton
          v-if="type === 'create'"
          class="ml-auto"
          :class="{ 'opacity-25': loading, 'btn-disabled': !hasChanges }"
          :disabled="!hasChanges || loading"
        >
          crear
        </PrimaryButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, watchEffect, computed,watch } from "vue";
import PrimaryButton from "../PrimaryButton.vue";
import validateEmail from "../../utils/emailValidator";
import InputError from "../../Components/InputError.vue";
import { UPDATE_USER, FETCH_USERS, CREATE_USER } from "../../store/types";
import rutHelper from "../../utils/Ruts";
import { useStore } from "vuex";


const formatDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (regex.test(dateString)) {
    return dateString;
  } else if (dateString) { // Verifica que dateString no sea undefined
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${year}-${month}-${day}`;
    }
  }
  return ""; // Manejo de caso no válido o undefined
};


const props = defineProps({
  modalTitle: {
    type: String,
    required: true,
  },
  modalContent: {
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
  type: {
    type: String,
  },
});

const store = useStore();

const loading = ref(false);
const update_error_message = ref("");
// const update_rut_error= ref(false)

const userTypes = [
  { value: 1, text: "Admin" },
  { value: 2, text: "User" },
];

const mapRoleIdToUserType = (roleId) => {
  return roleId === 1 ? 1 : roleId === 2 ? 2 : "";
};


const form = reactive({
  name:
    props.type === "update"
      ? props.tableData?.name
      : props.type === "create"
      ? ""
      : "",
  email:
    props.type === "update"
      ? props.tableData?.email
      : props.type === "create"
      ? ""
      : "",
  rut:
    props.type === "update"
      ? rutHelper.normalizeRut(props.tableData?.rut)
      : props.type === "create"
      ? ""
      : "",
  birthday:
    props.type === "update"
      ? formatDate(props.tableData.birthday)
      : props.type === "create"
      ? ""
      : "",
  address:
    props.type === "update"
      ? props.tableData?.address
      : props.type === "create"
      ? ""
      : "",
  typeuser: mapRoleIdToUserType(props.tableData?.role_id),
  password: "",
  errors: {
    email: "",
    rut: "",
    birthday: "",
    address: "",
    password: "",
  },
  touched: {
    name: false,
    email: false,
    rut: false,
    birthday: false,
    address: false,
    password: false,
  },
});


const formatRuts = () => {
  form.rut = rutHelper.formatRut(form.rut);
};

const handleBlur = (field) => {
  form.touched[field] = true;
  form.errors[field] = validateField(field);
};

const validateField = (field) => {
  if (field === "name" && !form.name) {
    return "Ingrese nombre";
  }
  if (field === "email") {
    if (!form.email) {
      return "Ingrese correo electrónico";
    }
    if (!validateEmail(form.email)) {
      return "Correo inválido";
    }
  }
  if(field==="rut"){
    if (field === "rut" && !form.rut) {
      return "Ingrese rut";
    }
    if(!rutHelper.validateRut(form.rut)){
      return "rut no valido"
    }
    if(update_error_message.value && update_error_message.value?.rut[0].toLowerCase().includes('rut')){
      loading.value = true; 
      return update_error_message.value?.rut[0];
    }
  }
  if (field === "birthday" && !form.birthday) {
    return "Ingrese fecha de nacimiento";
  }
  if (field === "address" && !form.address) {
    return "Ingrese direccion";
  }
  if (field === "password") {
    if (!form.password) {
      return "Ingrese contraseña";
    }
    if (form.password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres";
    }
    if (!/[A-Z]/.test(form.password)) {
      return "La contraseña debe contener al menos una letra mayúscula";
    }
    if (!/[a-z]/.test(form.password)) {
      return "La contraseña debe contener al menos una letra minúscula";
    }
    if (!/\d/.test(form.password)) {
      return "La contraseña debe contener al menos un número";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) {
      return "La contraseña debe contener al menos un símbolo";
    }
  }
  return "";
};

watchEffect(() => {
  if (form) {
    form.errors.name = validateField("name");
    form.errors.email = validateField("email");
    form.errors.rut = validateField("rut");
    form.errors.birthday = validateField("birthday");
    form.errors.address = validateField("address");
    form.errors.password = validateField("password");
  }
});

// Computed to check for changes to the form
const hasChanges = computed(() => {
  return (
    form.name !== (props.tableData?.name || "") ||
    form.email !== (props.tableData?.email || "") ||
    form.rut !== rutHelper.normalizeRut(props.tableData?.rut || "")  ||
    form.birthday !==
      (props.tableData?.birthday
        ? formatDate(props.tableData?.birthday)
        : "") ||
    form.address !== (props.tableData?.address || "") ||
    form.typeuser !== mapRoleIdToUserType(props.tableData?.role_id)
  );
});

const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const clearUpdateErrorMessage = () => {
  if (form.errors.rut) {
    loading.value = false; 
    update_error_message.value=""; // Limpiar el mensaje de error de la API
  }
};


const formupdate = async () => {
  loading.value = true;
  try {
    // Validate fields before proceeding with the form submission
    if (props.type === "update") {
      form.errors.name = validateField("name");
      form.errors.email = validateField("email");
      form.errors.rut = validateField("rut");
      form.errors.birthday = validateField("birthday");
      form.errors.address = validateField("address");

      if (
        form.errors.name ||
        form.errors.email ||
        form.errors.rut ||
        form.errors.birthday ||
        form.errors.address
      ) {
        loading.value = false;
        return;
      }
    }
    if (props.type === "create") {
      form.errors.name = validateField("name");
      form.errors.email = validateField("email");
      form.errors.rut = validateField("rut");
      form.errors.birthday = validateField("birthday");
      form.errors.address = validateField("address");
      form.errors.password = validateField("password");

      if (
        form.errors.name ||
        form.errors.email ||
        form.errors.rut ||
        form.errors.birthday ||
        form.errors.address ||
        form.errors.password
      ) {
        loading.value = false;
        return;
      }
    }
    // Normalize the RUT when sending
    const rut = rutHelper.normalizeRut(form.rut);

    // payload object with modified fields
    const payload = {};
    if (form.name !== props.tableData?.name) {
      payload.name = form.name;
    }
    if (form.email !== props.tableData?.email) {
      payload.email = form.email;
    }
    if (rut !== rutHelper.normalizeRut(props.tableData?.rut)) {
      payload.rut = rut;
    }
    if (form.birthday !==  formatDate(props.tableData?.birthday)) {
      payload.birthday = form.birthday;
    }
    if (form.address !== props.tableData?.address) {
      payload.address = form.address;
    }
    if (form.typeuser !== mapRoleIdToUserType(props.tableData?.role_id)) {
      payload.role_id = form.typeuser;
    }

    // Check for changes to avoid sending an empty request
    if (Object.keys(payload).length === 0) {
      loading.value = false;
      return;
    }

    if (props.type === "update") {
      const totalResponse = {
        id: props.tableData?.id,
        payload: payload,
      };
      await store.dispatch(UPDATE_USER, totalResponse);
      await store.dispatch(FETCH_USERS, {
        page: props.currentPage,
        per_page: 10,
      });
      props.onClose();
    }

    if (props.type === "create") {
      const payloadCreate = {
        name: form.name,
        email: form.email,
        rut: rut,
        birthday: form.birthday,
        address: form.address,
        role_id: form.typeuser,
        password: form.password,
      };
      await store.dispatch(CREATE_USER, { payload: payloadCreate });
      await store.dispatch(FETCH_USERS, {
        page: props.currentPage,
        per_page: 10,
      });
      props.onClose();
      loading.value = false;
    }
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    
    update_error_message.value =error.response?.data.errors||error.response?.data.errors?error.response?.data?.error||error.response?.data?.errors:'Ocurrió un error inesperado, vuelve a intentarlo más tarde.';
  }
};
</script>
<style scoped>
.btn-disabled {
  color: black;
  cursor: not-allowed;
  border: 1px solid gray;
}
</style>
