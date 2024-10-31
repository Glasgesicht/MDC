import { createApp } from "vue";
import { createPinia, type Store } from "pinia";
import PrimeVue from "primevue/config";

import App from "./App.vue";
import router from "./router";

import "primevue/resources/themes/nano/theme.css";
import "primeicons/primeicons.css";
import "./assets/main.css";

const app = createApp(App);
const pinia = createPinia();

app.use(PrimeVue);
app.use(pinia);
app.use(router);

app.mount("#app");
