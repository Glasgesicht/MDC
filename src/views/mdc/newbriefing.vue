<script setup lang="ts">
import { inject } from "vue";
import { storeToRefs } from "pinia";
import { usePackageStore } from "@/controller/stores/packageStore";

import { useFlightStore } from "@/controller/stores/flightStore";

const { selectedPKG } = storeToRefs(usePackageStore());

const { getFlight } = storeToRefs(useFlightStore());

const { pagenr } = defineProps({
  pagenr: {
    required: true,
    type: Number,
  },
});

const showROE = inject("showROE");
</script>

<template>
  <div class="mdcpage bdr ctr" name="mdcpage" id="gameplan">
    <div class="c36 r bdr ctr">
      RED BOXED CELLS SECRET WHEN COMPLETE - SHRED AFTER USE
    </div>
    <div class="c3 y bdr ctr">PAGE {{ pagenr }}</div>
    <div class="c33 g bdr ctr">BRIEFING</div>
    <div class="c6 g bdr ctr">MISSION</div>
    <div class="c6 w bdr ctr">
      {{ getFlight.MSNumber }}
    </div>
    <div class="c5 g bdr ctr">CALLSIGN</div>
    <div class="c7 w bdr ctr">
      {{ getFlight.callsign }} {{ getFlight.callsignNumber }}
    </div>
    <!-- 
    <select v-model="getFlight.callsign" class="mcd-s-5 mcd-bow dropdown">
      <option v-for="flight of flights">{{ flight.callsignRaw }}</option>
    </select>-->
    <div class="c5 g bdr ctr">PACKAGE</div>
    <div class="c7 w bdr ctr">
      {{ selectedPKG.name }}
    </div>
    <div class="c6 g bdr ctr">HOMEPLATE</div>
    <input v-model="getFlight.DEP.NAME" class="c6 w tb bdr ctr" />
    <div class="c24 r2 squad bdr logo ctr" style="
        color: #c1d7ff;
        font-size: 33px;
        font-family: Copperplate Gothic Light;
        font-style: normal;
      ">
      16th Air Expeditionary Wing
    </div>
    <div class="c6 g bdr ctr">MSN TYPE</div>
    <input class="c6 w bdr ctr" v-model="getFlight.missionType" />

    <div class="c6 g bdr ctr">PACKAGE TASK</div>
    <input v-model="selectedPKG.packageTask" class="c30 w tb bdr ctr" />
    <div class="c6 g bdr ctr">FLIGHT TASK</div>
    <input v-model="getFlight.task" class="c30 w tb bdr ctr" />
    <div class="c36 g bdr ctr">SITUATION</div>
    <textarea v-model="selectedPKG.situation" class="r9 c36 w tb bdr ctr" />

    <div class="c18 g bdr ctr">SURFACE THREATS</div>
    <div class="c18 g bdr ctr">AIR THREATS</div>
    <textarea v-model="selectedPKG.surfaceThreat" class="r3 c18 w tb bdr ctr" />
    <textarea v-model="selectedPKG.airThreat" class="r3 c18 w tb bdr ctr" />
    <div class="c36 g bdr ctr">GAMEPLAN</div>

    <textarea type="text" style="background-color: white; color: black"
      :class="`c36 tb ${showROE ? 'r23' : 'r34'} bdr ctr`" v-model="getFlight.gameplan" />
    <div v-if="showROE" class="roehead c36 bdr ctr" style="width: 100%">
      RULES OF ENGAGEMENT
    </div>
    <textarea v-if="showROE" type="text" v-model="selectedPKG.roe" class="c36 roe textbox non-resizable r6 bdr ctr" />
  </div>
</template>

<style scoped>
@import "@/assets/styles/mdc.css";

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
