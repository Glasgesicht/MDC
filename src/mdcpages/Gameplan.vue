<script setup lang="ts">
import { inject } from "vue";
import Textarea from "primevue/inputtext";
import { storeToRefs } from "pinia";
import { usePackageStore } from "../stores/packageStore";
import Input from "primevue/inputtext";

import { flights } from "../config/flights";
import { useFlightStore } from "@/stores/flightStore";

const {
  airThreat,
  packageTask,
  pkgnr,
  situation,
  surfaceThreat,
  roe,
  selectedPKG,
} = storeToRefs(usePackageStore());

const { selectedFlight, gameplan } = storeToRefs(useFlightStore());

const { pagenr } = defineProps({
  pagenr: {
    required: true,
    type: Number,
  },
});

const showROE = inject("showROE");
</script>

<template>
  <div class="mcdpage" id="gameplan">
    <div class="border pagenr center-text">PAGE {{ pagenr }}</div>
    <div class="border header">BRIEFING CARD</div>
    <div class="border mcd-s-6 mcd-wog">MISSION</div>
    <div class="border mcd-s-6 mcd-bow">
      {{ selectedFlight.MSNumber }}
    </div>
    <div class="border mcd-s-5 mcd-wog">CALLSIGN</div>
    <div class="border mcd-s-5 mcd-bow">
      {{ selectedFlight.callsign }} {{ selectedFlight.callsignNumber }}
    </div>
    <!-- 
    <select v-model="selectedFlight.callsign" class="mcd-s-5 mcd-bow dropdown">
      <option v-for="flight of flights">{{ flight.callsignRaw }}</option>
    </select>-->
    <div class="border mcd-s-5 mcd-wog">PACKAGE</div>
    <div class="border mcd-s-5 mcd-bow">
      {{ pkgnr }}
    </div>
    <div class="border mcd-s-6 mcd-wog">HOMEPLATE</div>
    <Input
      v-model="selectedFlight.DEP.NAME"
      class="border mcd-s-6 mcd-bog textbox"
    />
    <div class="border mcd-rnlaf313">RNLAF 313 SQUADRON</div>
    <div class="border mcd-s-6 mcd-wog">MSN TYPE</div>
    <Input
      class="border mcd-s-6 mcd-bow textbox"
      v-model="selectedFlight.missionType"
    />

    <div class="border mcd-s-6 mcd-wog">PACKAGE TASK</div>
    <Input v-model="packageTask" class="border mcd-s-26 mcd-bog textbox" />
    <div class="border mcd-s-6 mcd-wog">FLIGHT TASK</div>
    <Input v-model="selectedFlight.task" class="border mcd-s-26 mcd-bow" />
    <div class="border mcd-s-col mcd-wog">SITUATION</div>
    <textarea
      v-model="situation"
      class="border mcd-row-5 mcd-s-col mcd-bow textbox"
    />

    <div class="border mcd-s-16 mcd-wog">SURFACE THREATS</div>
    <div class="border mcd-s-16 mcd-wog">AIR THREATS</div>
    <div class="border mcd-row-2 mcd-s-16 mcd-bow">
      {{ surfaceThreat }}
    </div>
    <textarea v-model="airThreat" class="mcd-row-2 mcd-s-16 mcd-bow textbox" />
    <div class="border mcd-s-col mcd-wog">GAMEPLAN</div>

    <textarea
      type="text"
      :class="`mcd-s-col  textbox ${showROE ? 'mcd-row-10' : 'mcd-row-16'}`"
      v-model="gameplan"
    />
    <div v-if="showROE" class="border roehead mcd-s-col" style="width: 100%">
      RULES OF ENGAGEMENT
    </div>
    <textarea
      v-if="showROE"
      type="text"
      v-model="roe"
      class="border mcd-s-col roe textbox non-resizable mcd-row-6"
    />
  </div>
</template>
