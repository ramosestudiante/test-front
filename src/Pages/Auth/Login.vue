<template>
  <GuestLayout>
    <head title="Log in" />

    <div v-if="status" class="mb-4 font-medium text-sm text-green-600">
      {{ status }}
    </div>

    <form @submit.prevent="formLogin" class="space-y-12" ref="form_ref">
      <div>
        <InputLabel for="email" value="Email" />

        <TextInput
          id="email"
          type="email"
          class="mt-1 block w-full"
          v-model="form.email"
          autocomplete="username"
          @blur="handleBlur('email')"
          :class="{ 'border-red-500': form.touched.email && form.errors.email }"
          placeholder="Ingresa tu correo electronico"
        />

        <InputError
          class="mt-2"
          :message="form.touched.email ? form.errors.email : ''"
        />
      </div>

      <div>
        <InputLabel for="password" value="Password" />

        <TextInput
          id="password"
          type="password"
          class="mt-1 block w-full"
          v-model="form.password"
          @blur="handleBlur('password')"
          :class="{
            'border-red-500': form.touched.password && form.errors.password,
          }"
          placeholder="Ingresa tu contraseña"
        />

        <InputError
          class="mt-2"
          :message="form.touched.password ? form.errors.password : ''"
        />
      </div>
      <InputError
          class="mt-2"
          :message="login_error_message ? login_error_message : ''"
        />

      <div class="flex items-center justify-between">
        <div>
          <label class="flex items-center space-x-4">
            <Checkbox name="remember" v-model:checked="form.remember" />
            <span class="text-sm text-gray-600">Remember me</span>
          </label>
        </div>
        <router-link
          :to="{name:'Register'}"
          class="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Registrate
        </router-link>
      </div>
      <div class="flex items-center justify-between">
        <!-- TODO -->
        <router-link
          :to="{name:'Welcome'}"
          class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >back</router-link
        >

        <PrimaryButton
          :class="{ 'opacity-25': form.loading }"
          :disabled="form.loading"
        >
          Log in
        </PrimaryButton>
      </div>
    </form>
  </GuestLayout>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Checkbox from "../../Components/Checkbox.vue";
import GuestLayout from "../../Layouts/GuestLayout.vue";
import InputError from "../../Components/InputError.vue";
import InputLabel from "../../Components/InputLabel.vue";
import PrimaryButton from "../../Components/PrimaryButton.vue";
import TextInput from "../../Components/TextInput.vue";
import { reactive, ref, watchEffect } from "vue";
import { LOG_IN } from "../../store/types";
import validateEmail from "../../utils/emailValidator";

const router = useRouter();
const store = useStore();

defineProps({
  status: {
    type: String,
  },
});

const form = reactive({
  email: "",
  password: "",
  remember: false,
  errors: {
    email: "",
    password: "",
  },
  loading: false,
  touched: {
    email: false,
    password: false,
  },
});

const form_ref = ref("");

const handleBlur = (field) => {
  form.touched[field] = true;
  form.errors[field] = validateField(field);
};

const validateField = (field) => {
  if (field === "email") {
    if (!form.email) {
      return "Ingrese correo electrónico";
    }
    if (!validateEmail(form.email)) {
      return "Correo inválido";
    }
  }
  if (field === "password") {
    if (!form.password) {
      return "Ingrese contraseña";
    }
    if (form.password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres";
    }
  }
  return "";
};

watchEffect(() => {
  form.errors.email = validateField("email");
  form.errors.password = validateField("password");
});

const login_error_message = ref("");

const formLogin = async () => {
  login_error_message.value = "";

  form.loading = true;
  try {
  
    form.errors.email = validateField("email");
    form.errors.password = validateField("password");

    if (form.errors.email || form.errors.password) {
      return;
    }
    const resp = {
      email: form.email,
      password: form.password,
      remember: form.remember,
    };
    const login_resp = await store.dispatch(LOG_IN, resp).catch(e=>login_error_message.value=e.response.data.error);
    if (login_resp.status === "success") {
      router.push({ name: "Dashboard" });
    }
  } catch (error) {
    if (error.response === undefined) {
      login_error_message.value =
        "Ocurrió un error inesperado, vuelve a intentarlo más tarde.";
    } else {
      login_error_message.value =
        "Las credenciales ingresadas son incorrectas.";
    }
  }
  form.loading = false;
};
</script>

<style scoped>
.border-red-500:focus {
  border-color: red;
}
</style>
