import { createApp } from "vue";
import "/src/style.css";
import axios from "axios";
import router from "/src/route/index.js";
import store from "/src/store/index.js";
import App from "/src/App.vue";
import "tailwindcss/tailwind.css";

// Create the Vue app instance
const app = createApp(App);

// Configure axios
axios.defaults.withCredentials = true;
app.config.globalProperties.axios = axios;

// Use the router and store
app.use(store);
app.use(router);

// Mount the app
app.mount("#app");
