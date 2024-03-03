<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref } from "vue";
import Textarea from "primevue/inputtext";
import { storeToRefs } from "pinia";
import { usePackageStore } from "../stores/packageStore";
import Dropdown from "primevue/dropdown";

import { flights } from "../config/constants";
import { calculateHeading, calculateDistance } from "@/utils/utilFunctions";
import { useFlightStore } from "@/stores/flightStore";

const { selectedPKG } = storeToRefs(usePackageStore());

const { selctedFlight } = storeToRefs(useFlightStore());

const pagenr = 1; // TODO: Compute based on selected pages for export

const departureName = "INCIRLIK AB"; // TODO: Make Dep/Arr/Alt more efficient via loop.
const departureTACAN = "21X DA";
const departureGround = "360.10";
const departureLength = "10,000";
const departureElevation = "232'";
const departureRunway = "I23 229°";
const departureILS = "111.70";

const arrivalName = "INCIRLIK AB";
const arrivalTACAN = "21X DA";
const arrivalGround = "360.10";
const arrivalLength = "10,000";
const arrivalElevation = "232'";
const arrivalRunway = "I23 229°";
const arrivalILS = "111.70";

const alternateName = "INCIRLIK AB";
const alternateTACAN = "21X DA";
const alternateGround = "360.10";
const alternateLength = "10,000";
const alternateElevation = "232'";
const alternateRunway = "I23 229°";
const alternateILS = "111.70";

const waypointAction = "Climb";
const waypointTimeOnStation = "21:24:54";
const waypointHeading = "243°";
const waypointDistance = "124 nm";
const waypointSpeed = ".72";
const waypointAltitude = "FL240";
const waypointMinimumFuel = ">2463";
const waypointNote = "WAIT: 01:24:32";

const bullseyeName = "SCIMITAR";
const bullseyeLatitude = 'N 40"30.243';
const bullseyeLongitude = 'E 032"16.885';

const hhmmss = (time: string) => {
  if (!time) return "";
  const date = new Date(time);
  return `${date.toLocaleTimeString()}`;
};

const waypoints = ref([
  { id: 1, name: "TAKEOFF" },
  { id: 2, name: "CLIMB" },
  { id: 3, name: "CRUISE" },
]);

const showROE = inject("showROE");
</script>

<template>
  {{ selctedFlight?.waypoints }}
  <div class="mcdpage">
    <div class="border pagenr">PAGE {{ pagenr }}</div>
    <div class="border header">WAYPOINTS</div>
    <div class="border mcd-s-3 mcd-wog">METAR</div>
    <div class="border mcd-s-29 mcd-bow">{{ selectedPKG.metar }}</div>

    <div class="border mcd-row-4 mcd-s-1 mcd-wog text-rotate-left">
      AIRFIELD
    </div>
    <div class="border mcd-s-3 mcd-row-1 mcd-wog"></div>
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

    <div class="border mcd-row-26 mcd-s-1 mcd-wog text-rotate-left">
      STEERPOINTS
    </div>

    <div class="border mcd-s-2 mcd-row-1 mcd-wog">#</div>
    <div class="border mcd-s-5 mcd-wog">ACTION</div>
    <div class="border mcd-s-4 mcd-wog">TOS</div>
    <div class="border mcd-s-3 mcd-wog">HDG</div>
    <div class="border mcd-s-3 mcd-wog">DIST</div>
    <div class="border mcd-s-3 mcd-wog">TAS/M</div>
    <div class="border mcd-s-3 mcd-wog">ALT</div>
    <div class="border mcd-s-3 mcd-wog">FUEL</div>
    <div class="border mcd-s-5 mcd-wog">NOTE</div>

    <div class="mcd-s-31 parent" v-for="index in new Array(24).keys()">
      <div class="border mcd-s-2 mcd-wog">{{ index + 1 }}</div>
      <div :class="`border mcd-s-5 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ selctedFlight?.waypoints[index]?.type }}
      </div>
      <div :class="`border mcd-s-4 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ hhmmss(selctedFlight?.waypoints[index]?.tot) }}
      </div>
      <div :class="`border mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{
          selctedFlight?.waypoints[index + 1]?.longitude
            ? calculateHeading(
                selctedFlight?.waypoints[index]?.latitude,
                selctedFlight?.waypoints[index]?.longitude,
                selctedFlight?.waypoints[index + 1]?.latitude,
                selctedFlight?.waypoints[index + 1]?.longitude
              )
            : ""
        }}
      </div>
      <div :class="`border mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{
          selctedFlight?.waypoints[index + 1]?.longitude
            ? calculateDistance(
                selctedFlight?.waypoints[index]?.latitude,
                selctedFlight?.waypoints[index]?.longitude,
                selctedFlight?.waypoints[index + 1]?.latitude,
                selctedFlight?.waypoints[index + 1]?.longitude
              ) + "nm"
            : ""
        }}
      </div>
      <div :class="`border mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ selctedFlight?.waypoints[index]?.mach?.toFixed(2) }}
      </div>
      <div :class="`border mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{
          selctedFlight?.waypoints[index].altitude
            ? selctedFlight?.waypoints[index]?.altitude + "ft"
            : ""
        }}
      </div>
      <div :class="`border mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{}}
      </div>
      <div :class="`border mcd-s-5 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ selctedFlight?.waypoints[index]?.activity }}
      </div>
    </div>

    <div
      class="border mcd-wog"
      style="grid-row-start: 32; grid-column: 2 / span 2; grid-column-start: 2"
    >
      25
    </div>
    <div class="border mcd-s-5 mcd-row-1 mcd-wog" style="grid-row-start: 32">
      BULLSEYE
    </div>
    <div class="border mcd-s-8 mcd-bow" style="grid-row-start: 32">
      {{ bullseyeName }}
    </div>
    <div class="border mcd-s-3 mcd-wog" style="grid-row-start: 32">LAT</div>
    <div class="border mcd-s-5 mcd-bow" style="grid-row-start: 32">
      {{ bullseyeLatitude }}
    </div>
    <div class="border mcd-s-3 mcd-wog" style="grid-row-start: 32">LONG</div>
    <div class="border mcd-s-5 mcd-bow" style="grid-row-start: 32">
      {{ bullseyeLongitude }}
    </div>
  </div>
</template>
<style scoped>
.parent {
  display: inline-grid;
  grid-template-columns: repeat(31, 1fr);
  grid-template-rows: repeat(1, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}
</style>
