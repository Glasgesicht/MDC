<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref } from "vue";
import Textarea from "primevue/inputtext";
import { storeToRefs } from "pinia";
import { useMCDStore } from "../stores/mdcData";
import Dropdown from "primevue/dropdown";

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
const metar = 'weather';
const departureName = 'INCIRLIK AB';
const departureTACAN = '21X DA';
const departureGround = '360.10';
const departureLength = '10,000';
const departureElevation = '232\'';
const departureRunway = 'I23 229°';
const departureILS = '111.70';

const arrivalName = 'INCIRLIK AB';
const arrivalTACAN = '21X DA';
const arrivalGround = '360.10';
const arrivalLength = '10,000';
const arrivalElevation = '232\'';
const arrivalRunway = 'I23 229°';
const arrivalILS = '111.70';

const alternateName = 'INCIRLIK AB';
const alternateTACAN = '21X DA';
const alternateGround = '360.10';
const alternateLength = '10,000';
const alternateElevation = '232\'';
const alternateRunway = 'I23 229°';
const alternateILS = '111.70';

const waypointNumber = 1;
const waypointAction = 'Climb';
const waypointTimeOnStation = '21:24:54';
const waypointHeading = '243°';
const waypointDistance = '124 nm';
const waypointSpeed = '.72';
const waypointAltitude = 'FL240';
const waypointMinimumFuel = '>2463';
const waypointNote = 'WAIT: 01:24:32'

const waypoints = ref([
  {id: 1, name: 'TAKEOFF'},
  {id: 2, name: 'CLIMB'},
  {id: 3, name: 'CRUISE'}
])

const showROE = inject("showROE");
</script>

<template>
  <div class="mcdpage">
    <div class="border pagenr">PAGE {{ pagenr }}</div>
    <div class="border header">WAYPOINTS</div>
    <div class="border mcd-s-3 mcd-wog">METAR</div>
    <div class="border mcd-s-29 mcd-bow">{{ metar }}</div>

    <div class="border mcd-row-4 mcd-s-1 mcd-wog text-rotate-left">AIRFIELD</div>
    <div class="border mcd-s-3 mcd-row-1 mcd-wog"> </div>
    <div class="border mcd-s-9 mcd-wog">AIRFIELD</div>
    <div class="border mcd-s-3 mcd-wog">TCN</div>
    <div class="border mcd-s-3 mcd-wog">FREQ</div>
    <div class="border mcd-s-3 mcd-wog">LENGTH</div>
    <div class="border mcd-s-3 mcd-wog">ELEV</div>
    <div class="border mcd-s-4 mcd-wog">RWY</div>
    <div class="border mcd-s-3 mcd-wog">ILS</div>

    <div class="border mcd-s-3 mcd-row-1 mcd-wog">DEP</div>
    <div class="border mcd-s-9 mcd-row-1 mcd-bow">{{ departureName }}</div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">{{ departureTACAN }}</div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">{{ departureGround }}</div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">{{ departureLength }}</div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">{{ departureElevation }}</div>
    <div class="border mcd-s-4 mcd-row-1 mcd-bow">{{ departureRunway }}</div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">{{ departureILS }}</div>

    <div class="border mcd-s-3 mcd-row-1 mcd-wog">ARR</div>
    <div class="border mcd-s-9 mcd-row-1 mcd-bow">{{ arrivalName }}</div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">{{ arrivalTACAN }}</div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">{{ arrivalGround }}</div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">{{ arrivalLength }}</div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">{{ arrivalElevation }}</div>
    <div class="border mcd-s-4 mcd-row-1 mcd-bow">{{ arrivalRunway }}</div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">{{ arrivalILS }}</div>

    <div class="border mcd-s-3 mcd-row-1 mcd-wog">ALT</div>
    <div class="border mcd-s-9 mcd-row-1 mcd-bow">{{ alternateName }}</div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">{{ alternateTACAN }}</div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">{{ alternateGround }}</div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">{{ alternateLength }}</div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">{{ alternateElevation }}</div>
    <div class="border mcd-s-4 mcd-row-1 mcd-bow">{{ alternateRunway }}</div>
    <div class="border mcd-s-3 mcd-row-1 mcd-bow">{{ alternateILS }}</div>
    
    <div class="border mcd-row-26 mcd-s-1 mcd-wog text-rotate-left">STEERPOINTS</div>
    
    <div class="border mcd-s-2 mcd-row-1 mcd-wog">WP</div>
    <div class="border mcd-s-5 mcd-wog">ACTION</div>
    <div class="border mcd-s-4 mcd-wog">TOS</div>
    <div class="border mcd-s-3 mcd-wog">HDG</div>
    <div class="border mcd-s-3 mcd-wog">DIST</div>
    <div class="border mcd-s-3 mcd-wog">TAS/M</div>
    <div class="border mcd-s-3 mcd-wog">ALT</div>
    <div class="border mcd-s-3 mcd-wog">>FUEL</div>
    <div class="border mcd-s-5 mcd-wog">NOTE</div>

    <div class="mcd-s-31"
    v-for="index in [...Array(24).keys()]"
  > 
  {{ index }}
    <div class="border mcd-s-2 mcd-row-1 mcd-wog">WP</div>
    <div class="border mcd-s-5 mcd-wog">ACTION</div>
  </div>



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
<style scoped>
    .parent { display: inline-grid; grid-template-columns: repeat(31, 1fr); grid-template-rows: repeat(24, 1fr); grid-column-gap: 0px; grid-row-gap: 0px; }
</style>