<script setup lang="ts">
import { inject } from "vue";
import Textarea from "primevue/inputtext";
import { storeToRefs } from "pinia";
import { useMCDStore } from "../stores/mdcData";

import { flights } from "../config/constants";

const {
  airT,
  callsign,
  flightTask,
  gameplan,
  homePlate,
  missionNr,
  msnType,
  pkgTask,
  pkgnr,
  situation,
  surfaceT,
  roe,
} = storeToRefs(useMCDStore());

const pagenr = 1; // TODO: Compute based on selected pages for export

const showROE = inject("showROE");
</script>

<template>
  <div class="mcdpage">
    <div class="border pagenr center-text">
      <p>PAGE {{ pagenr }}</p>
    </div>
    <div class="border header"><p>BRIEFING CARD</p></div>
    <div class="border mcd-s-6 mcd-wog">MISSION</div>
    <div class="border mcd-s-6 mcd-bow">{{ missionNr }}</div>
    <div class="border mcd-s-5 mcd-wog">CALLSIGN</div>
    <select v-model="callsign" class="mcd-s-5 mcd-bow">
      <option v-for="flight of flights">{{ flight.Callsign }}</option>
    </select>
    <div class="border mcd-s-5 mcd-wog">PACKAGE</div>
    <div class="border mcd-s-5 mcd-bow">{{ pkgnr }}</div>
    <div class="border mcd-s-6 mcd-wog">HOMEPLATE</div>
    <div class="border mcd-s-6 mcd-bog">{{ homePlate }}</div>
    <div class="border mcd-rnlaf313">RNLAF 313 SQUADRON</div>
    <div class="border mcd-s-6 mcd-wog">MSN TYPE</div>
    <div class="border mcd-s-6 mcd-bow">{{ msnType }}</div>
    <div class="border mcd-s-6 mcd-wog">PACKAGE TASK</div>
    <input v-model="pkgTask" class="border mcd-s-26 mcd-bog textbox" />
    <div class="border mcd-s-6 mcd-wog">FLIGHT TASK</div>
    <input v-model="flightTask" class="border mcd-s-26 mcd-bow" />
    <div class="border mcd-s-col mcd-wog">SITUATION</div>
    <textarea
      v-model="situation"
      class="border mcd-row-5 mcd-s-col mcd-bow textbox"
    />

    <div class="border mcd-s-16 mcd-wog">SURFACE THREATS</div>
    <div class="border mcd-s-16 mcd-wog">AIR THREATS</div>
    <div class="border mcd-row-2 mcd-s-16 mcd-bow">{{ surfaceT }}</div>
    <textarea v-model="airT" class="mcd-row-2 mcd-s-16 mcd-bow textbox" />
    <div class="border mcd-s-col mcd-wog">GAMEPLAN</div>

    <textarea
      type="text"
      :class="`mcd-s-col textbox ${showROE ? 'mcd-row-10' : 'mcd-row-16'}`"
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
