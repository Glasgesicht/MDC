import { ref, computed, type WritableComputedRef, type Ref, watch } from "vue";
import {
  defineStore,
  storeToRefs,
  type SubscriptionCallbackMutation,
} from "pinia";
import type { Flight, Package } from "@/types/mdcDataTypes";
import { useFlightStore } from "./flightStore";
import { threatRanges } from "@/config/threatRanges";

export const usePackageStore = defineStore("package", () => {
  // Data for the entire mission goes here
  const packages: Ref<Package[]> = ref(new Array());

  const threats = ref(
    threatRanges.map((n) => {
      return { ...n, display: true };
    })
  );
  /*const agencies = ref(
    new Array<{
      name: string;
      freq: string;
      type: string;
      activity: string;
      tacan: string;
      lat: string;
      lon: string;
      alt: string;
      active: boolean;
    }>()
  );*/

  // Data for only the selected package goes here
  const initState = {
    airThreat: "",
    bullseye: {
      lat: "",
      long: "",
      name: "Bullseye",
    },
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
  };
  const selectedPKG: Ref<Package> = ref(structuredClone(initState));

  watch(selectedPKG, () => {
    useFlightStore().reset();
  });

  function reset() {
    selectedPKG.value = structuredClone(initState);
  }
  const allFlightsFromPackage: WritableComputedRef<Flight[]> = computed({
    set(value: Flight[]) {
      const index = packages.value.findIndex(
        (flight) => flight.name === selectedPKG.value.name
      );
      if (index === -1) return;
      packages.value[index].flights = value;
    },
    get() {
      const index = packages.value.findIndex(
        (flight) => flight.name === selectedPKG.value.name
      );
      if (index === -1) return [];
      return packages.value[index].flights;
    },
  });

  const situation = computed({
    get() {
      return selectedPKG.value.situation;
    },
    set(value) {
      selectedPKG.value.situation = value;
    },
  });
  const surfaceThreat = computed({
    get() {
      return selectedPKG.value.surfaceThreat;
    },
    set(value) {
      selectedPKG.value.surfaceThreat = value;
    },
  });
  const airThreat = computed({
    get() {
      return selectedPKG.value.airThreat;
    },
    set(value) {
      selectedPKG.value.airThreat = value;
    },
  });
  const roe = computed({
    get() {
      return selectedPKG.value.roe;
    },
    set(value) {
      selectedPKG.value.roe = value;
    },
  });

  const packageTask = computed({
    get() {
      return selectedPKG.value.packageTask;
    },
    set(value) {
      selectedPKG.value.packageTask = value;
    },
  });

  //const missionNr = ref(12345);
  const pkgnr = computed(() => selectedPKG.value.name);

  const ramrod = computed({
    get() {
      return selectedPKG.value.ramrod;
    },
    set(value) {
      selectedPKG.value.ramrod = value;
    },
  });

  return {
    packages,
    selectedPKG,
    allFlightsFromPackage,

    situation,
    packageTask,
    surfaceThreat,
    airThreat,
    roe,
    threats,

    pkgnr,
    reset,
    ramrod,
  };
});
