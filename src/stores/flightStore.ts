import { defineStore, storeToRefs } from "pinia";
import { usePackageStore } from "../stores/packageStore";
import { computed, ref, type Ref } from "vue";
import { F15Flights, F16Flights } from "@/config/flights";
import type { FlightMember } from "@/types/mdcDataTypes";

const f15callsigns = F15Flights.map((flight) => flight.Callsign);
const f16callsigns = F16Flights.map((flight) => flight.Callsign);

export const useFlightStore = defineStore("flight", () => {
  // const { selctedFlight } = storeToRefs(usePackageStore());

  const selctedFlight = ref({
    aircrafttype: "",
    callsign: "",
    callsignNumber: NaN,
    flightTask: "",
    gameplan: "",
    MSNumber: "",
    missionType: "",
    tacan: "",
    task: "",
    units: new Array<FlightMember>(),
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

  // Might not need this because it's set in createFlights as a macro.
  /*
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
  });*/

  // not enirely sure why i have an explicit getter/setter here, but that's okay
  const gameplan = computed({
    get() {
      return selctedFlight.value.gameplan ?? null;
    },
    set(value) {
      selctedFlight.value.gameplan = value;
    },
  });

  const setNewCallsign = (opts: {
    aircrafttype: string;
    callsign: string;
    callsignNumber: number;
  }) => {
    selctedFlight.value.aircrafttype = opts.aircrafttype;
    selctedFlight.value.callsign = opts.callsign;
    selctedFlight.value.callsignNumber = opts.callsignNumber;
  };

  return { selctedFlight, flightTask, gameplan, setNewCallsign };
});
