import { defineStore, storeToRefs } from "pinia";
import { usePackageStore } from "../stores/packageStore";
import { computed, ref, type Ref } from "vue";
import type { Flight } from "@/types/mdcDataTypes";
import { F15Flights, F16Flights } from "@/config/constants";

const f15callsigns = F15Flights.map((flight) => flight.Callsign);
const f16callsigns = F16Flights.map((flight) => flight.Callsign);

export const useFlightStore = defineStore("flight", () => {
  // const { selctedFlight } = storeToRefs(usePackageStore());

  const selctedFlight: Ref<Flight> = ref({} as Flight);
  // Here goes all the data that only belongs to the currently selected flight

  const homePlate = computed({
    get() {
      return selctedFlight.value.homeplate;
    },
    set(value) {
      selctedFlight.value.homeplate = value;
    },
  });

  const msnType = computed({
    get() {
      return selctedFlight.value.task;
    },
    set(value) {
      selctedFlight.value.task = value;
    },
  });

  const flightTask = computed({
    get() {
      return selctedFlight.value.flightTask;
    },
    set(value) {
      selctedFlight.value.flightTask = value;
    },
  });

  const VHF = computed(() => {
    if (f16callsigns.includes(selctedFlight.value.callsign))
      return `141.${selctedFlight.value.callsignNumber}0`;
    else if (f15callsigns.includes(selctedFlight.value.callsign))
      return `144.${selctedFlight.value.callsignNumber}0`;
    return "XXX.XX";
  });
  const UHF = computed(() => {
    if (f16callsigns.includes(selctedFlight.value.callsign))
      return `267.${selctedFlight.value.callsignNumber}0`;
    else if (f15callsigns.includes(selctedFlight.value.callsign))
      return `269.${selctedFlight.value.callsignNumber}0`;
    return "XXX.XX";
  });

  const gameplan = computed({
    get() {
      return selctedFlight.value.gameplan;
    },
    set(value) {
      selctedFlight.value.gameplan = value;
    },
  });

  return { selctedFlight, homePlate, msnType, flightTask, gameplan };
});
