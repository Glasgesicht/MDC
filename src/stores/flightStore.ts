import { defineStore, storeToRefs } from "pinia";
import { usePackageStore } from "../stores/packageStore";
import { computed, ref, type Ref } from "vue";
import type { Flight } from "@/types/mdcDataTypes";
import { F15Flights, F16Flights } from "@/config/flights";

const f15callsigns = F15Flights.map((flight) => flight.Callsign);
const f16callsigns = F16Flights.map((flight) => flight.Callsign);

export const useFlightStore = defineStore("flight", () => {
  // const { selctedFlight } = storeToRefs(usePackageStore());

  const selctedFlight: Ref<Flight> = ref({
    aircrafttype: "",
    callsign: "",
    callsignNumber: NaN,
    flightTask: "",
    gameplan: "",
    MSNumber: "",
    missionType: "",
    tacan: "",
    task: "",
    UHF: "",
    units: [],
    VHF: "",
    waypoints: new Array(25),
    DEP: {
      NAME: "",
      ARR: "",
      TACAN: "",
      HDG: "",
      ILS: "",
      ELEV: "",
      LEN: "",
    },
    ARR: {
      NAME: "",
      ARR: "",
      TACAN: "",
      HDG: "",
      ILS: "",
      ELEV: "",
      LEN: "",
    },
    ALT: {
      NAME: "",
      ARR: "",
      TACAN: "",
      HDG: "",
      ILS: "",
      ELEV: "",
      LEN: "",
    },
  });
  // Here goes all the data that only belongs to the currently selected flight

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
    //need to figure out freq's for other wings
  });
  const UHF = computed(() => {
    if (f16callsigns.includes(selctedFlight?.value.callsign))
      return `267.${selctedFlight?.value.callsignNumber}0`;
    else if (f15callsigns.includes(selctedFlight?.value.callsign))
      return `269.${selctedFlight?.value.callsignNumber}0`;
    return "XXX.XX";
  });

  const gameplan = computed({
    get() {
      return selctedFlight.value.gameplan ?? null;
    },
    set(value) {
      selctedFlight.value.gameplan = value;
    },
  });

  return { selctedFlight, flightTask, gameplan };
});
