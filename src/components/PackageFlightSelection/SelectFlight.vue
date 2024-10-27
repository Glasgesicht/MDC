<template>
  <Dropdown
    v-model="selectedPackage"
    :options="packages"
    class="m-5"
    optionLabel="name"
    placeholder="Select A Package"
  />
  <Dropdown
    v-model="selectedFlight"
    class="m-5"
    :options="selectedPKG?.flights"
    :disabled="!selectedPKG"
    optionLabel="callsign"
    placeholder="Select A Flight"
    ><template #option="{ option }"
      >{{ option?.callsign }} {{ option?.callsignNumber }}</template
    ><template #value="{ value }"
      >{{ value?.callsign }}
      {{
        value?.callsignNumber > 0 ? value?.callsignNumber : `Select Flight`
      }}</template
    >
  </Dropdown>
</template>

<script setup lang="ts">
import { useFlightStore } from "@/stores/flightStore";
import { usePackageStore } from "@/stores/packageStore";
import type { Flight, Package } from "@/types/mdcDataTypes";
import { storeToRefs } from "pinia";
import Dropdown, { type DropdownChangeEvent } from "primevue/dropdown";
import { computed, ref } from "vue";

const { showPKGSelection = true, showFlightSelection = true } = defineProps<{
  showPKGSelection: boolean;
  showFlightSelection: boolean;
}>();

const packageStore = usePackageStore();
const { packages, selectedPKG } = storeToRefs(packageStore);

const selectedPackage = computed({
  get(): Package {
    // No clue why this would error
    return selectedPKG.value as Package;
  },
  set(value: Package) {
    packageStore.setSelectedPKGID(
      packages.value.findIndex((pkg) => pkg.name === value.name)
    );
  },
});

const flightStore = useFlightStore();
const { getFlight } = storeToRefs(flightStore);

const selectedFlight = computed({
  get(): Flight {
    return getFlight.value as Flight;
  },

  set(value: Flight) {
    flightStore.setFlightId(
      selectedPKG.value.flights.findIndex(
        (flight) =>
          flight.callsign === value.callsign &&
          flight.callsignNumber === value.callsignNumber
      )
    );
  },
});
</script>
