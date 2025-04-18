import { defineStore, storeToRefs } from "pinia";
import { usePackageStore } from "@/controller/stores/packageStore";
import { flights } from "@/config/defaults/flights";
import { getSTN } from "@/controller/utils/utilFunctions";
import { initFlight } from "@/types/mdcDataTypes";

export const useFlightStore = defineStore("flightSore", {
  state: () => ({ selectedFlightId: 0 }),
  getters: {
    getFlight: (state) => {
      const { selectedPKG } = storeToRefs(usePackageStore());
      return selectedPKG.value?.flights[state.selectedFlightId];
    },
  },
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

      // updates ladder for all flights
      usePackageStore().selectedPKG.flights.forEach((flight, i, all) => {
        const newComms = flights.find((n) => n.callsign === flight.callsign);

        if (newComms) {
          all.forEach((curr, n) => {
            if (curr.comms.radio1.length >= i + 14)
              curr.comms.radio1[i + 14] = {
                description: newComms?.callsign + " " + newComms?.number || "",
                freq: newComms?.pri.freq || "",
                name: newComms?.pri.name || "",
                number: parseInt(newComms?.pri.number || ""),
              };
            if (curr.comms.radio2.length >= i + 14)
              curr.comms.radio2[i + 14] = {
                description: newComms?.callsign || "",
                freq: newComms?.sec.freq || "",
                name: newComms?.sec.name || "" + newComms?.number || "",
                number: parseInt(newComms?.sec.number || ""),
              };
          });
        }
      });
    },
  },
});
