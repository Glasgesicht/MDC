import { createApp } from "vue";
import { createPinia, type Store } from "pinia";
import PrimeVue from "primevue/config";
import { style } from "./config/styling/style";

import { definePreset } from "@primevue/themes";

import App from "./App.vue";
import router from "./controller/router";
import Aura from "@primevue/themes/aura";

import "primeicons/primeicons.css";
import "./assets/styles/main.css";

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

if (
  localStorage.getItem("darkmode") === "true" ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches &&
    !localStorage.getItem("darkmode"))
) {
  document.documentElement.classList.toggle("darkmode");
}
