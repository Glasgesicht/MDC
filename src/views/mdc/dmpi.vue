<!--script setup lang="ts">
import { inject, onMounted, onUnmounted, ref } from "vue";
import Textarea from "primevue/inputtext";
import { storeToRefs } from "pinia";
import { usePackageStore } from "@/stores/packageStore";
import Dropdown from "primevue/dropdown";

import { flights } from "../config/flights";
import {
  calculateHeading,
  calculateDistance,
  toLatString,
  toLongString,
} from "@/utils/utilFunctions";
import { useFlightStore } from "@/stores/flightStore";

const { selectedPKG } = storeToRefs(usePackageStore());

const { getFlight } = storeToRefs(useFlightStore());

const { pagenr } = defineProps({
  pagenr: {
    required: true,
    type: Number,
  },
});

const dmpiName = "P12";
const dmpiTarget = "PRI";
const dmpiMgrs = "34Q FJ 12345 67890";
const dmpiCoordinates = "N 32”25.032 E 035”25.556";
const dmpiElevation = "1,023 ft";

const trackName = "Sonny";
const trackType = "CAP";
const trackDimension = "30x10";
const trackHeading = "252°M";
const trackCoordinates = "N 32”25.032 E 035”25.556";
const trackBullseye = "257 / 121";

const showROE = inject("showROE");
</script>

<template>
  <div class="mcdpage">
    <div class="border pagenr">PAGE {{ pagenr }}</div>
    <div class="border header">DMPI</div>

    <div class="border mcd-s-2 mcd-wog">WP</div>
    <div class="border mcd-s-5 mcd-wog">NAME</div>
    <div class="border mcd-s-2 mcd-wog">TGT</div>
    <div class="border mcd-s-9 mcd-wog">MGRS</div>
    <div class="border mcd-s-11 mcd-wog">LAT / LONG</div>
    <div class="border mcd-s-3 mcd-wog">ELEV</div>

    <div class="mcd-s-32 parent" v-for="index in new Array(8).keys()">
      <div class="border mcd-s-2 mcd-wog">
        {{ index + 81 }}
      </div>
      <div :class="`border  mcd-s-5 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ dmpiName }}
      </div>
      <div :class="`border  mcd-s-2 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ dmpiTarget }}
      </div>
      <div :class="`border  mcd-s-9 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ dmpiMgrs }}
      </div>
      <div :class="`border  mcd-s-11 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ dmpiCoordinates }}
      </div>
      <div :class="`border  mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ dmpiElevation }}
      </div>
    </div>

    <div class="border mcd-s-32 mcd-wog">TRACKS</div>
    <div class="border mcd-s-8 mcd-wog">TRACK NAME</div>
    <div class="border mcd-s-3 mcd-wog">TYPE</div>
    <div class="border mcd-s-3 mcd-wog">DIM</div>
    <div class="border mcd-s-3 mcd-wog">HDG</div>
    <div class="border mcd-s-11 mcd-wog">LAT / LONG</div>
    <div class="border mcd-s-4 mcd-wog">BULLS</div>

    <div class="mcd-s-32 parent" v-for="index in new Array(20).keys()">
      <div :class="`border  mcd-s-8 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ trackName }}
      </div>
      <div :class="`border  mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ trackType }}
      </div>
      <div :class="`border  mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ trackDimension }}
      </div>
      <div :class="`border  mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ trackHeading }}
      </div>
      <div :class="`border  mcd-s-11 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ trackCoordinates }}
      </div>
      <div :class="`border  mcd-s-4 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        {{ trackBullseye }}
      </div>
    </div>
  </div>
</template>
<style scoped>
.parent {
  display: inline-grid;
  grid-template-columns: repeat(32, 1fr);
  grid-template-rows: repeat(1, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}
.font500 {
  font-weight: 500;
}
</style>
