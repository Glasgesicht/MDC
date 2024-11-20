import type { theatre } from "@/types/theatre";
import { file } from "jszip";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const useGlobalStore = defineStore("global", {
  state: (): {
    file: boolean;
    filename: string;
    theatre: theatre;
    time: {
      missionStartTime: number;
      year: number;
      month: number;
      day: number;
    };
    stateChanged: number;
    weather: {};
    callsigns: Array<any>;
    agencies: Array<any>; //TODO: Move agencies here
    poe: Array<any>;
    airports: Array<any>; // TODO: Move them here
  } => ({
    file: false,
    theatre: "Caucasus",
    time: {
      missionStartTime: 0,
      year: 2017,
      month: 1,
      day: 1,
    },
    stateChanged: 0,
    weather: {},
    filename: "Select File",
    callsigns: new Array(),
    agencies: new Array(),
    poe: new Array(), // TODO: Points of interests
    airports: new Array(),
  }),
  actions: {
    setFile(file: boolean) {
      this.$state.file = file;
    },
    setTheatre(theatre: theatre) {
      this.$state.theatre = theatre;
    },
    setStateChanged() {
      this.$state.stateChanged = Date.now();
    },
    setFilename(filename: string) {
      this.$state.filename = filename;
    },
  },
  getters: {
    getFile: (state) => state.file,
    getStateChanged: (state) => state.stateChanged,
    getTheatre: (state) => state.theatre,
    getFilename: (state) => state.filename,
  },
});
