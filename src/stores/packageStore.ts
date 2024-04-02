import { ref, computed, type WritableComputedRef, type Ref } from "vue";
import { defineStore, type SubscriptionCallbackMutation } from "pinia";
import type { Flight, Package } from "@/types/mdcDataTypes";

export const usePackageStore = defineStore("package", () => {
  // Data for the entire mission goes here
  const packages: Ref<Package[]> = ref(new Array());

  // Data for only the selected package goes here
  const selectedPKG: Ref<Package> = ref({
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
  });
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

  // is this per package? // Making Getters/Setters for each.
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

  return {
    packages,
    selectedPKG,
    allFlightsFromPackage,

    situation,
    packageTask,
    surfaceThreat,
    airThreat,
    roe,

    pkgnr,
  };
});
