import { useManualRefHistory, useRefHistory } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useFlightStore } from "@/stores/flightStore";
import { usePackageStore } from "@/stores/packageStore";
import { computed, ref, watch } from "vue";
import { set } from "lodash";

export const useEditHistory = () => {
  const packageStore = usePackageStore();

  const { selectedPKG } = storeToRefs(packageStore);

  // I shouldn've lest the stores at setup style to not have to do this...
  const writeablePackages = computed({
    get: () => packageStore.selectedPKG ?? {},
    set: (val) => {
      try {
        if (
          val &&
          val?.flights.length > 0 &&
          selectedPKG.value?.flights.find(
            (e) =>
              val.flights[0].callsign === e.callsign &&
              val.flights[0].callsignNumber === e.callsignNumber
          )
        )
          packageStore.setSelectedPKG(val);
      } catch (e) {
        //nothing
      }
    },
  });

  const { history, undo, redo, canRedo, canUndo, reset, commit, clear } =
    useRefHistory(writeablePackages, { deep: true });

  function clearHistroy() {
    setTimeout(() => {
      clear();
      reset();
    }, 100);
  }

  return {
    history,
    undo,
    redo,
    clearHistroy,
    canRedo,
    canUndo,
  };
};
