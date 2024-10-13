import type { theatre } from "@/types/theatre";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
// kinda not used since packages are used as top level for now.
// might populate if needed.
export const useGlobalStore = defineStore("global", () => {
  const file = ref(false);
  const theater: Ref<theatre> = ref("Caucasus");
  const stateChanged = ref(0);
  return { file, stateChanged, theater };
});
