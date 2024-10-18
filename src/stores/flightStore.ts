import { defineStore, storeToRefs } from "pinia";
import { usePackageStore } from "../stores/packageStore";
import { computed, ref, toRaw, watch, type Ref } from "vue";
import { F15Flights, F16Flights, flights } from "@/config/flights";
import type { Flight, FlightMember } from "@/types/mdcDataTypes";
import { getSTN } from "@/utils/utilFunctions";
import type { Misc } from "@/types/dtcTypes";

export const useFlightStore = defineStore("flightSore", {
  state: () => ({ selectedFlightId: 0 }),
  actions: {
    setFlightId(id: number) {
      this.selectedFlightId = id;
    },
    updateFligh() {
      const callsign = this.getFlight.callsign;

      this.getFlight.units.forEach((_n, i) => {
        this.getFlight.units[i].STN = getSTN(
          this.getFlight.aircrafttype,
          this.getFlight.callsign,
          this.getFlight.callsignNumber % 8,
          i
        );

        this.getFlight.units[i].L16 =
          callsign.charAt(0) +
          callsign.charAt(callsign.length - 1) +
          this.getFlight.callsignNumber +
          (Number(i) + 1);
      });

      const newComms = flights.find((n) => n.callsign === callsign);

      this.getFlight.mycomm = {
        pri: {
          description: newComms?.callsign + " " + newComms?.number || "",
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
    },
  },
  getters: {
    getFlight: (state) => {
      const { selectedPKG } = storeToRefs(usePackageStore());
      return selectedPKG.value?.flights[state.selectedFlightId];
    },
  },
});

/*
      setFlightId(){
        this.getFlight++
      }
    },
    setNewCallsign(opts: {
      aircrafttype: string;
      callsign: string;
      callsignNumber: number;
    }) {
      this.aircrafttype = opts.aircrafttype;
      this.callsign = opts.callsign;
      this.callsignNumber = opts.callsignNumber;
    },
    /** TODO: Gehört in den PackageStore 
  },
  getters: {
    getFlight: (state) => state,
    flightTask: (state) => state.flightTask,
  },
});
*/
