import { defineStore, storeToRefs } from "pinia";
import { usePackageStore } from "../stores/packageStore";
import { computed, ref, type Ref } from "vue";
import { F15Flights, F16Flights } from "@/config/flights";
import type { FlightMember } from "@/types/mdcDataTypes";

import { cloneDeep } from "lodash";
import { getSTN } from "@/utils/utilFunctions";

const f15callsigns = F15Flights.map(
  (flight) => flight.callsign + " " + flight.number
);
const f16callsigns = F16Flights.map(
  (flight) => flight.callsign + " " + flight.number
);

export const useFlightStore = defineStore("flight", () => {
  // const { selectedFlight } = storeToRefs(usePackageStore());

  const initState = {
    aircrafttype: "",
    callsign: "",
    callsignNumber: NaN,
    flightTask: "",
    fence_in: 0,
    fence_out: 0,
    comms: {
      // This is awfully F-16 specific, but we can just overwrite this, might adjust the type though
      radio1: new Array<{ freq: string; name: string }>(20),
      radio2: new Array<{ freq: string; name: string }>(20),
    },
    gameplan: "",
    MSNumber: "",
    missionType: "",
    tacan: "",
    task: "",
    units: new Array<FlightMember>(),
    waypoints: new Array<{
      activity: string;
      airspeed_calibrated: number;
      airspeed_total: number;
      altitude: number;
      groundspeed: number;
      latitude: number;
      longitude: number;
      mach: number;
      name: string;
      tot: string;
      type: string;
      waypointNr: number;
    }>(),
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
  };
  const selectedFlight: Ref<typeof initState> = ref(cloneDeep(initState));

  function reset() {
    selectedFlight.value = cloneDeep(initState);
  }

  // Here goes all the data that only belongs to the currently selected flight
  const flightTask = computed({
    get() {
      return selectedFlight.value.flightTask;
    },
    set(value: string) {
      selectedFlight.value.flightTask = value;
    },
  });

  // Might not need this because it's set in createFlights as a macro.
  /*
  const VHF = computed(() => {
    if (f16callsigns.includes(selectedFlight.value.callsign))
      return `141.${selectedFlight.value.callsignNumber}0`;
    else if (f15callsigns.includes(selectedFlight.value.callsign))
      return `144.${selectedFlight.value.callsignNumber}0`;
    return "XXX.XX";
    //need to figure out freq's for other wings
  });
  const UHF = computed(() => {
    if (f16callsigns.includes(selectedFlight?.value.callsign))
      return `267.${selectedFlight?.value.callsignNumber}0`;
    else if (f15callsigns.includes(selectedFlight?.value.callsign))
      return `269.${selectedFlight?.value.callsignNumber}0`;
    return "XXX.XX";
  });*/

  const updateFligh = () => {
    const callsign = selectedFlight.value.callsign;

    selectedFlight.value.units.forEach((_n, i) => {
      selectedFlight.value.units[i].STN = getSTN(
        selectedFlight.value.aircrafttype,
        selectedFlight.value.callsignNumber % 8,
        i
      );

      selectedFlight.value.units[i].L16 =
        callsign.charAt(0) +
        callsign.charAt(callsign.length - 1) +
        selectedFlight.value.callsignNumber +
        (Number(i) + 1);
    });
  };

  // not enirely sure why i have an explicit getter/setter here, but that's okay
  const gameplan = computed({
    get() {
      return selectedFlight.value.gameplan ?? null;
    },
    set(value: string) {
      selectedFlight.value.gameplan = value;
    },
  });

  const setNewCallsign = (opts: {
    aircrafttype: string;
    callsign: string;
    callsignNumber: number;
  }) => {
    selectedFlight.value.aircrafttype = opts.aircrafttype;
    selectedFlight.value.callsign = opts.callsign;
    selectedFlight.value.callsignNumber = opts.callsignNumber;
  };

  return {
    selectedFlight,
    flightTask,
    gameplan,
    setNewCallsign,
    updateFligh,
    reset,
  };
});
