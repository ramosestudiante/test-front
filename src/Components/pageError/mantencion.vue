<template>
  <div style="background-color: #fff">
    <a-row justify="center">
      <a-col :lg="14" :xl="14">
        <img class="img-fluid" src="@/assets/images/mantención.png" alt="" />
      </a-col>
    </a-row>
    <a-row justify="center">
      <a-col>
        <a-typography-title
          style="bottom: 0px; font-family: 'Urbanist'; text-align: center"
        >
          Plataforma en mantenimiento
        </a-typography-title>
        <p>
          Disculpen las molestias, estamos trabajando para mejorar el servicio
          de nuestra plataforma.
        </p>
      </a-col>
    </a-row>
    <a-row justify="center">
      <a-col>
          <a-button @click="home()" type="primary">Back Home</a-button>
        </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

    const router = useRouter();
    const home = () => {
      router.push({ name: "Dashboard" });
    };
</script>

<style></style>
