<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref } from "vue";
import Textarea from "primevue/inputtext";
import { storeToRefs } from "pinia";
import { usePackageStore } from "../stores/packageStore";
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

const { selctedFlight } = storeToRefs(useFlightStore());

const {pagenr} = defineProps({
  pagenr:{
    required:true,
    type: Number
  }
})

const dmpiName = "P12";
const dmpiTarget = "PRI";
const dmpiMgrs = "34Q FJ 12345 67890";
const dmpiCoordinates = "N 32”25.032 E 035”25.556";
const dmpiElevation = "1,023 ft"

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

    <div class="border mcd-s-2 mcd-wog"><p>WP</p></div>
    <div class="border mcd-s-5 mcd-wog"><p>NAME</p></div>
    <div class="border mcd-s-2 mcd-wog"><p>TGT</p></div>
    <div class="border mcd-s-9 mcd-wog"><p>MGRS</p></div>
    <div class="border mcd-s-11 mcd-wog"><p>LAT / LONG</p></div>
    <div class="border mcd-s-3 mcd-wog"><p>ELEV</p></div>

    <div class="mcd-s-32 parent" v-for="index in new Array(8).keys()">
      <div class="border mcd-s-2 mcd-wog">
        <p>{{ index + 81 }}</p>
      </div>
      <div :class="`border mcd-s-5 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{ dmpiName }}</p>
      </div>
      <div :class="`border mcd-s-2 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{dmpiTarget}}</p>
      </div>
      <div :class="`border mcd-s-9 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{dmpiMgrs}}</p class="font500">
      </div>
      <div :class="`border mcd-s-11 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{dmpiCoordinates}}</p>
      </div>
      <div :class="`border mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{dmpiElevation}}</p>
      </div>
    </div>

    <div class="border mcd-s-32 mcd-wog"><p>TRACKS</p></div>
    <div class="border mcd-s-8 mcd-wog"><p>TRACK NAME</p></div>
    <div class="border mcd-s-3 mcd-wog"><p>TYPE</p></div>
    <div class="border mcd-s-3 mcd-wog"><p>DIM</p></div>
    <div class="border mcd-s-3 mcd-wog"><p>HDG</p></div>
    <div class="border mcd-s-11 mcd-wog"><p>LAT / LONG</p></div>
    <div class="border mcd-s-4 mcd-wog"><p>BULLS</p></div>

    <div class="mcd-s-32 parent" v-for="index in new Array(20).keys()">
        <div :class="`border mcd-s-8 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
            <p class="font500">{{trackName}}</p>
        </div>
      <div :class="`border mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{trackType}}</p>
      </div>
      <div :class="`border mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{trackDimension}}</p>
      </div>
      <div :class="`border mcd-s-3 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{trackHeading}}</p class="font500">
      </div>
      <div :class="`border mcd-s-11 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{trackCoordinates}}</p>
      </div>
      <div :class="`border mcd-s-4 ${index % 2 ? 'mcd-bog' : 'mcd-bow'}`">
        <p class="font500">{{trackBullseye}}</p>
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
