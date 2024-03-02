<script setup lang="ts">
import { inject } from "vue";
import Textarea from "primevue/inputtext";
import { storeToRefs } from "pinia";
import { usePackageStore } from "../stores/packageStore";

import { flights } from "../config/constants";
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

const { selctedFlight, gameplan } = storeToRefs(useFlightStore());

const pagenr = 1; // TODO: Compute based on selected pages for export

const showROE = inject("showROE");
</script>

<template>
  {{ selctedFlight }}
  <div class="mcdpage">
    <div class="border pagenr center-text">
      <p>PAGE {{ pagenr }}</p>
    </div>
    <div class="border header"><p>BRIEFING CARD</p></div>
    <div class="border mcd-s-6 mcd-wog"><p>MISSION</p></div>
    <div class="border mcd-s-6 mcd-bow">
      <p>{{ selctedFlight.MSNumber }}</p>
    </div>
    <div class="border mcd-s-5 mcd-wog"><p>CALLSIGN</p></div>
    <div class="border mcd-s-5 mcd-bow">
      <p>{{ selctedFlight.callsign }} {{ selctedFlight.callsignNumber }}</p>
    </div>
    <!-- 
    <select v-model="selctedFlight.callsign" class="mcd-s-5 mcd-bow dropdown">
      <option v-for="flight of flights">{{ flight.callsignRaw }}</option>
    </select>-->
    <div class="border mcd-s-5 mcd-wog"><p>PACKAGE</p></div>
    <div class="border mcd-s-5 mcd-bow">
      <p>{{ pkgnr }}</p>
    </div>
    <div class="border mcd-s-6 mcd-wog"><p>HOMEPLATE</p></div>
    <div class="border mcd-s-6 mcd-bog">
      <p>{{ selctedFlight.homeplate }}</p>
    </div>
    <div class="border mcd-rnlaf313"><p>RNLAF 313 SQUADRON</p></div>
    <div class="border mcd-s-6 mcd-wog"><p>MSN TYPE</p></div>
    <input class="border mcd-s-6 mcd-bow" v-model="selctedFlight.missionType" />

    <div class="border mcd-s-6 mcd-wog"><p>PACKAGE TASK</p></div>
    <input v-model="packageTask" class="border mcd-s-26 mcd-bog textbox" />
    <div class="border mcd-s-6 mcd-wog"><p>FLIGHT TASK</p></div>
    <input v-model="selctedFlight.task" class="border mcd-s-26 mcd-bow" />
    <div class="border mcd-s-col mcd-wog"><p>SITUATION</p></div>
    <textarea
      v-model="situation"
      class="border mcd-row-5 mcd-s-col mcd-bow textbox"
    />

    <div class="border mcd-s-16 mcd-wog"><p>SURFACE THREATS</p></div>
    <div class="border mcd-s-16 mcd-wog"><p>AIR THREATS</p></div>
    <div class="border mcd-row-2 mcd-s-16 mcd-bow">{{ surfaceThreat }}</div>
    <textarea v-model="airThreat" class="mcd-row-2 mcd-s-16 mcd-bow textbox" />
    <div class="border mcd-s-col mcd-wog"><p>GAMEPLAN</p></div>

    <textarea
      type="text"
      :class="`mcd-s-col textbox ${showROE ? 'mcd-row-10' : 'mcd-row-16'}`"
      v-model="gameplan"
    />
    <div v-if="showROE" class="border roehead mcd-s-col" style="width: 100%">
      <p>RULES OF ENGAGEMENT</p>
    </div>
    <textarea
      v-if="showROE"
      type="text"
      v-model="roe"
      class="border mcd-s-col roe textbox non-resizable mcd-row-6"
    />
  </div>
</template>
