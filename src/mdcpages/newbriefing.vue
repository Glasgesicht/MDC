<script setup lang="ts">
import { inject } from "vue";
import Textarea from "primevue/inputtext";
import { storeToRefs } from "pinia";
import { usePackageStore } from "../stores/packageStore";

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

const { selectedFlight } = storeToRefs(useFlightStore());

const { pagenr } = defineProps({
  pagenr: {
    required: true,
    type: Number,
  },
});

const showROE = inject("showROE");
</script>

<template>
  <div class="mdcpage bdr" id="gameplan">
    <div class="c36 r bdr">
      RED BOXED CELLS SECRET WHEN COMPLETE - SHRED AFTER USE
    </div>
    <div class="c3 y bdr">PAGE {{ pagenr }}</div>
    <div class="c33 g bdr">COMMUNICATIONS</div>
    <div class="c6 g bdr">MISSION</div>
    <div class="c6 w bdr">
      {{ selectedFlight.MSNumber }}
    </div>
    <div class="c5 g bdr">CALLSIGN</div>
    <div class="c7 w bdr">
      {{ selectedFlight.callsign }} {{ selectedFlight.callsignNumber }}
    </div>
    <!-- 
    <select v-model="selectedFlight.callsign" class="mcd-s-5 mcd-bow dropdown">
      <option v-for="flight of flights">{{ flight.callsignRaw }}</option>
    </select>-->
    <div class="c5 g bdr">PACKAGE</div>
    <div class="c7 w bdr">
      {{ pkgnr }}
    </div>
    <div class="c6 g bdr">HOMEPLATE</div>
    <input v-model="selectedFlight.DEP.NAME" class="c6 w tb bdr" />
    <div class="c24 r2 squad bdr">RNLAF 313 SQUADRON</div>
    <div class="c6 g bdr">MSN TYPE</div>
    <input class="c6 w bdr" v-model="selectedFlight.missionType" />

    <div class="c6 g bdr">PACKAGE TASK</div>
    <input v-model="packageTask" class="c30 w tb bdr" />
    <div class="c6 g bdr">FLIGHT TASK</div>
    <input v-model="selectedFlight.task" class="c30 w tb bdr" />
    <div class="c36 g bdr">SITUATION</div>
    <textarea v-model="situation" class="r9 c36 w tb bdr" />

    <div class="c18 g bdr">SURFACE THREATS</div>
    <div class="c18 g bdr">AIR THREATS</div>
    <textarea v-model="surfaceThreat" class="r3 c18 w tb bdr" />
    <textarea v-model="airThreat" class="r3 c18 w tb bdr" />
    <div class="c36 g bdr">GAMEPLAN</div>

    <textarea
      type="text"
      :class="`c36 tb ${showROE ? 'r23' : 'r34'} bdr`"
      v-model="selectedFlight.gameplan"
    />
    <div v-if="showROE" class="roehead c36 bdr" style="width: 100%">
      RULES OF ENGAGEMENT
    </div>
    <textarea
      v-if="showROE"
      type="text"
      v-model="roe"
      class="c36 roe textbox non-resizable r6 bdr"
    />
  </div>
</template>

<style scoped>
@import "@/assets/newstyle.css";
.parent {
  display: inline-grid;
  grid-template-columns: repeat(36, 1fr);
  grid-template-rows: repeat(1, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}
.bingo {
  display: inline-grid;
  grid-template-columns: repeat(20, 1fr);
  grid-template-rows: repeat(1, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}
.shuffle {
  display: inline-grid;
  grid-template-columns: repeat(16, 1fr);
  grid-template-rows: repeat(1, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}
.font500 {
  font-weight: 500;
}
</style>
