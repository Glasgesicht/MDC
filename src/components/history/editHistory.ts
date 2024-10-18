import { useManualRefHistory, useRefHistory } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useFlightStore } from "@/stores/flightStore";
import { usePackageStore } from "@/stores/packageStore";
import { ref, watch } from "vue";

export const useEditHistory = () => {
  const { selectedPKG } = storeToRefs(usePackageStore());
  const { getFlight } = storeToRefs(useFlightStore());
  const { history, undo, redo, canRedo, canUndo, reset, commit, clear } =
    useRefHistory(getFlight, { deep: true });

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
