<template>
  <GuestLayout>
    <head title="Register" />

    <!-- Registration form -->
    <form @submit.prevent="formRegister">
      <div>
        <InputLabel for="name" value="Nombre" />

        <TextInput
          id="name"
          type="text"
          class="mt-1 block w-full"
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
        <InputLabel for="email" value="Correo Electronico" />

        <TextInput
          id="email"
          type="email"
          class="mt-1 block w-full"
          v-model="form.email"
          required
          autocomplete="username"
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
          @keyup="formatRuts"
          maxlength="12"
          placeholder="Ingresa tu rut"
          @blur="handleBlur('rut')"
          @input="clearUpdateErrorMessage"
          :class="{ 'border-red-500': form.touched.rut && form.errors.rut }"
        />

        <InputError
          class="mt-2"
          :message="form.touched.rut ? form.errors.rut : ''"
        />
      </div>

      <div>
        <InputLabel for="birthday" value="Fecha de Nacimiento" />

        <TextInput
          id="birthday"
          type="date"
          class="mt-1 block w-full"
          v-model="form.birthday"
          required
          autocomplete="birthday"
          placeholder="Ingresa tu Fecha de Nacimiento"
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
        <InputLabel for="address" value="Direccion" />

        <TextInput
          id="address"
          type="text"
          class="mt-1 block w-full"
          v-model="form.address"
          required
          autocomplete="address"
          placeholder="Ingresa tu Direccion"
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

      <div class="mt-4">
        <InputLabel for="password" value="Contraseña" />

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


      <div class="w-full flex items-center justify-between mt-10">
        <router-link
          :to="{name:'Welcome'}"
          class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Back
        </router-link>
        <div class="flex-grow"></div>

        <PrimaryButton
          class="ml-auto"
          :class="{ 'opacity-25': loading }"
          :disabled="loading"
        >
          Register
        </PrimaryButton>
      </div>
    </form>
  </GuestLayout>
</template>

<script setup>
import GuestLayout from "../../Layouts/GuestLayout.vue";
import InputError from "../../Components/InputError.vue";
import InputLabel from "../../Components/InputLabel.vue";
import PrimaryButton from "../../Components/PrimaryButton.vue";
import TextInput from "../../Components/TextInput.vue";
import { reactive, ref, watchEffect } from "vue";
import rutHelper from "../../utils/Ruts";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { REGISTER } from "../../store/types";
import validateEmail from "../../utils/emailValidator";
import cookieHandler from '../../utils/helpers/cookie.handler';


const router = useRouter();
const store = useStore();

const form = reactive({
  name: "",
  email: "",
  rut: "",
  birthday: "",
  address: "",
  password: "",
  errors: {
    name: "",
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
const register_error_message = ref("");

const loading = ref(false);

const formatRuts = () => {
  form.rut = rutHelper.formatRut(form.rut);
};
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleBlur = (field) => {
  form.touched[field] = true;
  form.errors[field] = validateField(field);
};

const clearUpdateErrorMessage = () => {
  if (form.errors.rut) {
    loading.value = false; 
    register_error_message.value=""; // Limpiar el mensaje de error de la API
  }
};


const validateField = (field) => {
  if (field === "name") {
    if (!form.name) {
      return "Ingrese nombre";
    }
  }
  if (field === "email") {
    if (!form.email) {
      return "Ingrese correo electrónico";
    }
    if (!validateEmail(form.email)) {
      return "Correo inválido";
    }
  }
  if (field === "rut") {
    if (!form.rut) {
      return "Ingrese rut";
    }
    if(!rutHelper.validateRut(form.rut)){
      return "rut no valido"
    }

    if(register_error_message.value && register_error_message.value?.rut[0].toLowerCase().includes('rut')){
      loading.value = true; 
      return register_error_message.value?.rut[0];
    }
  }
  if (field === "birthday") {
    if (!form.birthday) {
      return "Ingrese fecha de nacimiento";
    }
  }
  if (field === "address") {
    if (!form.birthday) {
      return "Ingrese direccion";
    }
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

// validate fields while I'm typing
watchEffect(() => {
  form.errors.name = validateField("name");
  form.errors.email = validateField("email");
  form.errors.rut = validateField("rut");
  form.errors.birthday = validateField("birthday");
  form.errors.address = validateField("address");
  form.errors.password = validateField("password");
});


const formRegister = async () => {
  register_error_message.value = "";

  loading.value = true;
  try {
   // Validate fields before proceeding with the form submission
    form.errors.name = validateField("name");
    form.errors.email = validateField("email");
    form.errors.rut = validateField("rut");
    form.errors.birthday = validateField("birthday");
    form.errors.address = validateField("address");
    form.errors.password = validateField("password");
  // Check if there are errors in the fields
    if (
      form.errors.name ||
      form.errors.email ||
      form.errors.rut ||
      form.errors.birthday ||
      form.errors.address ||
      form.errors.password
    ) {
      return;
    }
    const rut = rutHelper.normalizeRut(form.rut);
    const resp = {
      name: form.name,
      email: form.email,
      rut: rut,
      birthday: form.birthday,
      address: form.address,
      password: form.password,
      remember: true,
    };
    const register_resp = await store.dispatch(REGISTER, resp);
    if (register_resp.status === "success") {
      cookieHandler().setTokens(register_resp);
      router.push({ name: "Dashboard" });
    }
  } catch (error) {
   
      register_error_message.value = error.response?.data?.error;
      loading.value=false;

    if (error.response === undefined) {
      register_error_message.value =
        "Ocurrió un error inesperado, vuelve a intentarlo más tarde.";
    } 
  }
  loading.value = false;
};
</script>
