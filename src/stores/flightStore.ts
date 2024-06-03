import { defineStore, storeToRefs } from "pinia";
import { usePackageStore } from "../stores/packageStore";
import { computed, ref, toRaw, watch, type Ref } from "vue";
import { F15Flights, F16Flights, flights } from "@/config/flights";
import type { FlightMember } from "@/types/mdcDataTypes";
import { cloneDeep } from "lodash";
import { getSTN } from "@/utils/utilFunctions";

export const useFlightStore = defineStore("flight", () => {
  const initState = {
    aircrafttype: "",
    callsign: "",
    callsignNumber: NaN,
    isActive: false,
    flightTask: "",
    fence_in: 0,
    fence_out: 0,
    comms: {
      // This is awfully F-16 specific, but we can just overwrite this, might adjust the type though
      radio1: new Array<{
        freq: string;
        name: string;
        number?: number;
        description: string;
      }>(20),
      // Also, those values are not computed, because we need to be able to freely set them if needed
      radio2: new Array<{
        freq: string;
        name: string;
        number?: number;
        description: string;
      }>(20),
    },
    // This is for the individual flights, making is easier to shift flights around witout complicated logic, although this maybe cases some redundancies.
    // Might refactor later
    mycomm: {
      pri: <
        {
          freq: string;
          name: string;
          number?: number;
          description: string;
        }
      >{
        freq: "",
        name: "",
        number: NaN,
        description: "",
      },
      sec: <
        {
          freq: string;
          name: string;
          number?: number;
          description: string;
        }
      >{
        freq: "",
        name: "",
        number: NaN,
        description: "",
      },
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
      ICAO: "",
      ATIS: { uhf: "", vhf: "" },
      APPR: { uhf: "", vhf: "" },
      TOWER: { uhf: "", vhf: "" },
      GROUND: { uhf: "", vhf: "" },
      TACAN: "",
      HDG: "",
      ILS: "",
      ELEV: "",
      LEN: "",
    },
    ARR: {
      NAME: "",
      ICAO: "",
      ATIS: { uhf: "", vhf: "" },
      APPR: { uhf: "", vhf: "" },
      TOWER: { uhf: "", vhf: "" },
      GROUND: { uhf: "", vhf: "" },
      TACAN: "",
      HDG: "",
      ILS: "",
      ELEV: "",
      LEN: "",
    },
    ALT: {
      NAME: "",
      ICAO: "",
      ATIS: { uhf: "", vhf: "" },
      APPR: { uhf: "", vhf: "" },
      TOWER: { uhf: "", vhf: "" },
      GROUND: { uhf: "", vhf: "" },
      TACAN: "",
      HDG: "",
      ILS: "",
      ELEV: "",
      LEN: "",
    },
  };
  const selectedFlight: Ref<typeof initState> = ref(structuredClone(initState));

  function reset() {
    selectedFlight.value = cloneDeep(initState);
  }

  const useDefaults = ref(true);

  // Here goes all the data that only belongs to the currently selected flight
  const flightTask = computed({
    get() {
      return selectedFlight.value.flightTask;
    },
    set(value: string) {
      selectedFlight.value.flightTask = value;
    },
  });

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

    const newComms = flights.find((n) => n.callsign === callsign);

    selectedFlight.value.mycomm = {
      pri: {
        description: newComms?.callsign || "",
        freq: newComms?.pri.freq || "",
        name: newComms?.pri.name || "",
        number: parseInt(newComms?.pri.number || ""),
      },
      sec: {
        description: newComms?.callsign || "",
        freq: newComms?.sec.freq || "",
        name: newComms?.sec.name || "",
        number: parseInt(newComms?.sec.number || ""),
      },
    };
  };

  function updateLadder() {
    const { selectedPKG } = storeToRefs(usePackageStore());
    for (let i = 14; i < 20; i++) {
      //update Radios
      selectedFlight.value.comms.radio1[i] =
        selectedPKG.value.flights[i - 14]?.mycomm.pri;
      selectedFlight.value.comms.radio2[i] =
        selectedPKG.value.flights[i - 14]?.mycomm.sec;
    }
  }

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
    useDefaults,
    updateLadder,
  };
});
