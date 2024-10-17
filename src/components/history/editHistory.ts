import { useRefHistory } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useFlightStore } from "@/stores/flightStore";
import { usePackageStore } from "@/stores/packageStore";
import { watch } from "vue";

export const useEditHistory = () => {
  const { packages } = storeToRefs(usePackageStore());
  const { selectedFlight } = storeToRefs(useFlightStore());
  const { history, undo, redo, canRedo, canUndo } = useRefHistory(
    selectedFlight,
    {
      deep: true,
    }
  );

  const resetHistory = () => {
    setTimeout(() => {
      history.value = [];
    }, 100);
  };
  return {
    history,
    undo,
    redo,
    resetHistory,
    canRedo,
    canUndo,
  };
};
