import { defineStore } from "pinia";
import { ref } from "vue";

export const useFlightStore = defineStore("flight", () => {
  const metadata = ref({});
  return { metadata };
});
