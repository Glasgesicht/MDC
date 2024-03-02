<script setup lang="ts">
import { usePackageStore } from "@/stores/packageStore";
import { storeToRefs } from "pinia";
import { ref } from "vue";
const pagenr = ref(2); // TODO: AUTOMATE :)

const { pkgnr, roe } = storeToRefs(usePackageStore());

const { msnType, flightTask } = storeToRefs(useFlightStore());

import { flights } from "../config/constants";
import { useFlightStore } from "@/stores/flightStore";
</script>
<template>
  <div class="mcdpage">
    <div class="border pagenr">PAGE {{ pagenr }}</div>
    <div class="border header">BRIEFING CARD</div>
    <div class="border mcd-s-3 mcd-wog">MSN</div>
    <div class="border mcd-s-4 mcd-bow">{{ missionNr }}</div>
    <div class="border mcd-s-5 mcd-wog">CALLSIGN</div>
    <select v-model="callsign" class="dropdown mcd-s-6 mcd-bow">
      <option v-for="flight of flights">{{ flight }}</option>
    </select>
    <div class="border mcd-s-5 mcd-wog">PACKAGE</div>
    <div class="border mcd-s-9 mcd-bow">{{ pkgnr }}</div>
    <div class="border mcd-s-6 mcd-wog">FENCE I/O</div>
  </div>
</template>
@/stores/packageStore
