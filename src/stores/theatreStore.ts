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
    magVar: number;
    weather: {
      cloudBase: number;
      cloudCoverage: number;
      cloudThickness: number;
      dust: boolean;
      dustVisibility: number;
      dynamic: boolean;
      fog: boolean;
      fogThickness: number;
      precipitation: number;
      qnh: number;
      temperature: number;
      turbulence: number;
      visibility: number;
      wind33_Dir: number;
      wind33_Speed: number;
      wind1600_Dir: number;
      wind1600_Speed: number;
      wind6600_Dir: number;
      wind6600_Speed: number;
      wind26000_Dir: number;
      wind26000_Speed: number;
    };
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
    magVar: 0,
    weather: {
      cloudBase: 0,
      cloudCoverage: 0,
      cloudThickness: 0,
      dust: false,
      dustVisibility: 0,
      dynamic: false,
      fog: false,
      fogThickness: 0,
      precipitation: 0,
      qnh: 0,
      temperature: 0,
      turbulence: 0,
      visibility: 0,
      wind33_Dir: 0,
      wind33_Speed: 0,
      wind1600_Dir: 0,
      wind1600_Speed: 0,
      wind6600_Dir: 0,
      wind6600_Speed: 0,
      wind26000_Dir: 0,
      wind26000_Speed: 0,
    },
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
