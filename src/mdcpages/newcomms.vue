<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, computed } from "vue";
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
import type { bullseyes } from "@/config/bullseye";

const { selectedPKG } = storeToRefs(usePackageStore());

const { selectedFlight } = storeToRefs(useFlightStore());

const getUnit = computed(() => (i: number) => {
  // console.log(selectedFlight.value.units[i]);
  return selectedFlight.value.units[i] ?? null;
});

const { pagenr } = defineProps({
  pagenr: {
    required: true,
    type: Number,
  },
});

const hhmmss = (time: string) => {
  if (!time) return "";
  const date = new Date(time);
  return `${date.toLocaleTimeString()}`;
};

const showROE = inject("showROE");
</script>

<template>
  <div class="mdcpage">
    <div class="c36 r">
      RED BOXED CELLS SECRET WHEN COMPLETE - SHRED AFTER USE
    </div>
    <div class="c3 y">PAGE {{ pagenr }}</div>
    <div class="c33 g">COMMUNICATIONS</div>

    <div class="c2 g">UHF</div>
    <div class="c3 g">FREQ</div>
    <div class="c5 g">COLOUR</div>
    <div class="c1 g">F</div>
    <div class="c1 g">H</div>
    <div class="c6 g">DESCRIPTION</div>

    <div class="c2 g">VHF</div>
    <div class="c3 g">FREQ</div>
    <div class="c5 g">COLOUR</div>
    <div class="c1 g">F</div>
    <div class="c1 g">H</div>
    <div class="c6 g">DESCRIPTION</div>

    <div class="c36 parent" v-for="index in new Array(20).keys()">
      <div class="c2 g">{{ index + 1 }}</div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'}`">
        {{ selectedFlight.comms.radio1[index]?.freq }}
      </div>
      <div :class="`c5 ${index % 2 ? 'hg' : 'w'}`">
        {{ selectedFlight.comms.radio1[index]?.name }}
        {{ selectedFlight.comms.radio1[index]?.number || "" }}
      </div>
      <div :class="`c1 hr`"></div>
      <div :class="`c1 hr`"></div>
      <div :class="`c6 ${index % 2 ? 'hg' : 'w'}`">
        {{ selectedFlight.comms.radio1[index]?.description }}
      </div>

      <div class="c2 g">{{ index + 1 }}</div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'}`">
        {{ selectedFlight.comms.radio2[index]?.freq }}
      </div>
      <div :class="`c5 ${index % 2 ? 'hg' : 'w'}`">
        {{ selectedFlight.comms.radio2[index]?.name }}
        {{ selectedFlight.comms.radio2[index]?.number || "" }}
      </div>
      <div :class="`c1 hr`"></div>
      <div :class="`c1 hr`"></div>
      <div :class="`c6 ${index % 2 ? 'hg' : 'w'}`">
        {{ selectedFlight.comms.radio2[index]?.description }}
      </div>
    </div>

    <div class="c36 r">
      RED BOXED CELLS SECRET WHEN COMPLETE - SHRED AFTER USE
    </div>
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
