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
        v-model="getFlight.mycomm.pri.name"
        placeholder="none"
      />
      <Dropdown
        :disabled="useDefaults"
        :options="numbers"
        v-model="getFlight.mycomm.pri.number"
      />
      <Inputmask
        v-model="getFlight.mycomm.pri.freq"
        locale="en-US"
        :min-fraction-digits="2"
        :max="399.99"
        :max-fraction-digits="2"
      />
      SECONDARY
      <Dropdown
        :options="freqNames"
        v-model="getFlight.mycomm.sec.name"
        placeholder="none"
        :disabled="useDefaults"
      />
      <Dropdown
        :disabled="useDefaults"
        :options="numbers"
        v-model="getFlight.mycomm.sec.number"
      />
      <InputMask v-model="getFlight.mycomm.sec.freq" mask="9?99.999" />
    </div>
  </div>
</template>
<script setup lang="ts">
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import InputMask from "primevue/inputmask";
import { useFlightStore } from "@/stores/flightStore";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { freqNames } from "@/config/frequencies";

const useDefaults = ref(true);
const { getFlight } = storeToRefs(useFlightStore());

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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
