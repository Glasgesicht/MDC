import { createApp } from "vue";
import { createPinia, type Store } from "pinia";
import PrimeVue from "primevue/config";
import { style } from "./config/style";

import { definePreset } from "@primevue/themes";

import App from "./App.vue";
import router from "./router";
import Aura from "@primevue/themes/aura";

import "primeicons/primeicons.css";
import "./assets/main.css";

const app = createApp(App);
const pinia = createPinia();

const design = definePreset(Aura, style);

app.use(PrimeVue, {
  theme: {
    preset: design,
    options: {
      darkModeSelector: ".darkmode",
    },
  },
});
app.use(pinia);
app.use(router);

app.mount("#app");
