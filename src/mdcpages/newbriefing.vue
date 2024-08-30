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
  <div class="mdcpage" id="gameplan">
    <div class="c36 r">
      RED BOXED CELLS SECRET WHEN COMPLETE - SHRED AFTER USE
    </div>
    <div class="c3 y">PAGE {{ pagenr }}</div>
    <div class="c33 g">COMMUNICATIONS</div>
    <div class="c6 g">MISSION</div>
    <div class="c6 w">
      {{ selectedFlight.MSNumber }}
    </div>
    <div class="c5 g">CALLSIGN</div>
    <div class="c7 w">
      {{ selectedFlight.callsign }} {{ selectedFlight.callsignNumber }}
    </div>
    <!-- 
    <select v-model="selectedFlight.callsign" class="mcd-s-5 mcd-bow dropdown">
      <option v-for="flight of flights">{{ flight.callsignRaw }}</option>
    </select>-->
    <div class="c5 g">PACKAGE</div>
    <div class="c7 w">
      {{ pkgnr }}
    </div>
    <div class="c6 g">HOMEPLATE</div>
    <input v-model="selectedFlight.DEP.NAME" class="c6 w tb" />
    <div class="c24 r2 squad">RNLAF 313 SQUADRON</div>
    <div class="c6 g">MSN TYPE</div>
    <input class="c6 w" v-model="selectedFlight.missionType" />

    <div class="c6 g">PACKAGE TASK</div>
    <input v-model="packageTask" class="c30 w tb" />
    <div class="c6 g">FLIGHT TASK</div>
    <input v-model="selectedFlight.task" class="c30 w tb" />
    <div class="c36 g">SITUATION</div>
    <textarea v-model="situation" class="r5 c36 w tb" />

    <div class="c18 g">SURFACE THREATS</div>
    <div class="c18 g">AIR THREATS</div>
    <div class="r2 c18 w">
      {{ surfaceThreat }}
    </div>
    <textarea v-model="airThreat" class="r2 c18 w tb" />
    <div class="c36 g">GAMEPLAN</div>

    <textarea
      type="text"
      :class="`c36 tb ${showROE ? 'r28' : 'r34'}`"
      v-model="selectedFlight.gameplan"
    />
    <div v-if="showROE" class="roehead c36" style="width: 100%">
      RULES OF ENGAGEMENT
    </div>
    <textarea
      v-if="showROE"
      type="text"
      v-model="roe"
      class="c36 roe textbox non-resizable r6"
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
