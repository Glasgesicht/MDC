import { defineStore } from "pinia";
import { ref } from "vue";
// kinda not used since packages are used as top level for now.
// might populate if needed.
export const useGlobalStore = defineStore("global", () => {
  const file = ref();
  const stateChanged = ref(0);
  return { file, stateChanged };
});
