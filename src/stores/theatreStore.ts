import type { theatre } from "@/types/theatre";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const useGlobalStore = defineStore("global", () => {
  // this is used to show that a file has been laoded for the UI
  const file = ref(false);
  // globally define used theatre, to filter out dropdowns etc
  const theater: Ref<theatre> = ref("Caucasus");
  // I used this to arbitrarily force reloads using watch functions. Technicially should be here
  const stateChanged = ref(0);
  const missionStartTime = ref(0);
  return { file, stateChanged, theater, missionStartTime };
});
