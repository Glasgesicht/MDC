<template>
  <div class="nested" style="border: 1px solid black; margin: auto">
    <div class="nested" v-if="manual">
      <p>PRIMARY</p>
      <InputText />
      SECONDARY
      <InputText />
    </div>
    <div class="nested" v-else>
      PRIMARY
      <Dropdown
        :options="freqNames"
        :disabled="useDefaults"
        v-model="pri"
        placeholder="none"
      />
      <InputText :disabled="useDefaults" />
      SECONDARY
      <Dropdown
        :options="freqNames"
        v-model="sec"
        placeholder="none"
        :disabled="useDefaults"
      />
      <InputText :disabled="useDefaults" />
    </div>
  </div>
</template>
<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import InputMask from "primevue/inputmask";
import { useFlightStore } from "@/stores/flightStore";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { freqNames } from "@/config/frequencies";

const pri = ref("YELLOW");
const priN = ref(2);
const sec = ref("AMBER");
const secN = ref(6);

const { selectedFlight, useDefaults } = storeToRefs(useFlightStore());

//manual assignment
const manual = ref(false);
</script>

<style scoped>
.nested {
  display: inline-grid;
  grid-template-columns: repeat(31, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}
.nested * {
  margin: 3px;
}
</style>
