import type { theatre } from "@/types/theatre";
import { file } from "jszip";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const useGlobalStore = defineStore("global", {
  state: (): {
    file: boolean;
    theatre: theatre;
    missionStartTime: number;
    stateChanged: number;
  } => ({
    file: false,
    theatre: "Caucasus",
    missionStartTime: 0,
    stateChanged: 0,
  }),
  actions: {
    setFile(file: boolean) {
      this.$state.file = file;
    },
    setTheatre(theatre: theatre) {
      this.$state.theatre = theatre;
    },
    setMissionStartTime(missionStartTime: number) {
      this.$state.missionStartTime = missionStartTime;
    },
    setStateChanged() {
      this.$state.stateChanged = Date.now();
    },
  },
  getters: {
    getFile: (state) => state.file,
    getStateChanged: (state) => state.stateChanged,
    getTheatre: (state) => state.theatre,
    getMissionStartTime: (state) => state.missionStartTime,
  },
});
