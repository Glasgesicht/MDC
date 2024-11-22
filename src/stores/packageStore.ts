import { ref } from "vue";
import { defineStore } from "pinia";
import type { Package } from "@/types/mdcDataTypes";
import { threatRanges } from "@/config/defaults/threatRanges";

export const initState = {
  airThreat: "",
  bullseyes: [],
  selectedBullseye: 0,
  flights: new Array(),
  metar: "",
  name: "",
  packageTask: "",
  roe: "",
  situation: "",
  surfaceThreat: "",
  ramrod: "",
  codewords: [],

  agencies: new Array<any>(),
} satisfies Package;

export const threats = ref(
  threatRanges.map((n) => {
    return { ...n, display: true };
  })
);

export const usePackageStore = defineStore("package", {
  state: () => ({
    packages: new Array<Package>(),
    selectedPKGID: 0,
  }),
  getters: {
    selectedPKG: (state) => state.packages[state.selectedPKGID],
  },
  actions: {
    setSelectedPKG(pkg: Package) {
      this.packages[this.selectedPKGID] = pkg;
    },
    setSelectedPKGID(id: number) {
      this.selectedPKGID = id;
    },
    setPackages(packages: Package[]) {
      this.$state.packages = packages;
    },
  },
});
