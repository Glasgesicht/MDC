<script setup lang="ts">
import { usePackageStore } from "@/stores/packageStore";
import { storeToRefs } from "pinia";
import { ref } from "vue";
const pagenr = ref(2); // TODO: AUTOMATE :)

const { pkgnr, roe, selectedPKG } = storeToRefs(usePackageStore());

const { flightTask, selctedFlight } = storeToRefs(useFlightStore());

import { flights } from "../config/flights";
import { useFlightStore } from "@/stores/flightStore";
</script>
<template>
  <div class="mcdpage">
    <div class="border pagenr">
      <p>PAGE {{ pagenr }}</p>
    </div>
    <div class="border header"><p>BRIEFING CARD</p></div>
    <div class="border mcd-s-3 mcd-wog"><p>MSN</p></div>
    <div class="border mcd-s-4 mcd-bow">
      <p>{{ selctedFlight.MSNumber }}</p>
    </div>
    <div class="border mcd-s-5 mcd-wog"><p>CALLSIGN</p></div>
    <div class="border mcd-s-6 mcd-bow">
      <p>{{ selctedFlight.callsign }} {{ selctedFlight.callsignNumber }}</p>
    </div>
    <div class="border mcd-s-5 mcd-wog"><p>PACKAGE</p></div>
    <div class="border mcd-s-9 mcd-bow">
      <p>{{ pkgnr }}</p>
    </div>
    <div class="border mcd-s-6 mcd-wog"><p>FENCE I/O</p></div>
  </div>
</template>
