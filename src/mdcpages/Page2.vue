<script setup lang="ts">
import { usePackageStore } from "@/stores/packageStore";
import { storeToRefs } from "pinia";
import { ref } from "vue";
const { pagenr } = defineProps({
  pagenr: {
    required: true,
    type: Number,
  },
});

const { pkgnr, roe, selectedPKG } = storeToRefs(usePackageStore());

const { flightTask, selectedFlight } = storeToRefs(useFlightStore());

import { flights } from "../config/flights";
import { useFlightStore } from "@/stores/flightStore";
</script>
<template>
  <div class="mcdpage">
    <div class="border pagenr">PAGE {{ pagenr }}</div>
    <div class="border header">BRIEFING CARD</div>
    <div class="border mcd-s-3 mcd-wog">MSN</div>
    <div class="border mcd-s-4 mcd-bow">
      {{ selectedFlight.MSNumber }}
    </div>
    <div class="border mcd-s-5 mcd-wog">CALLSIGN</div>
    <div class="border mcd-s-6 mcd-bow">
      {{ selectedFlight.callsign }} {{ selectedFlight.callsignNumber }}
    </div>
    <div class="border mcd-s-5 mcd-wog">PACKAGE</div>
    <div class="border mcd-s-9 mcd-bow">
      {{ pkgnr }}
    </div>
    <div class="border mcd-s-6 mcd-wog">FENCE I/O</div>
  </div>
</template>
