<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, computed } from "vue";
import Textarea from "primevue/inputtext";
import { storeToRefs } from "pinia";
import { usePackageStore } from "../stores/packageStore";
import Dropdown from "primevue/dropdown";
import Input from "primevue/inputtext";

import { flights } from "../config/flights";
import {
  calculateHeading,
  calculateDistance,
  toLatString,
  toLongString,
} from "@/utils/utilFunctions";
import { useFlightStore } from "@/stores/flightStore";
import { threatRanges } from "@/config/threatRanges";

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

const showROE = inject("showROE");

const array_name = [
  {}
];

</script>



<template>
  <div class="mdcpage">
    <div class="c36 r">RED BOXED CELLS SECRET WHEN COMPLETE - SHRED AFTER USE</div>
    <div class="c3 y">PAGE {{ pagenr }}</div>
    <div class="c33 g">DATA CARD</div>

    <div class="c2 g">#</div>
    <div class="c2 g">A/C</div>
    <div class="c7 g">PILOT</div>
    <div class="c3 g">STN</div>
    <div class="c2 g">M3</div>
    <div class="c2 g">IDM</div>
    <div class="c2 g">A/A</div>
    <div class="c3 g">LASER</div>
    <div class="c3 g">SRCH</div>
    <div class="c3 g">CAP</div>
    <div class="c3 g">BLOCK</div>
    <div class="c4 g">SANC</div>
    <div class="c36 parent" v-for="index in new Array(4).keys()">
      <div class="c2 g">{{index + 1}}</div>
      <div :class="`c2 ${index % 2 ? 'hg' : 'w'}`">
        {{ getUnit(index)?.tailNr }}
      </div>
      <div :class="`c7 ${index % 2 ? 'hg' : 'w'}`">
        {{ getUnit(index)?.callsign }}
      </div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'}`">
        {{ getUnit(index)?.STN.padStart(5, "0") }}
      </div>
      <div :class="`c2 ${index % 2 ? 'hg' : 'w'}`">
        {{ getUnit(index)?.STN }}
      </div>
      <div :class="`c2 ${index % 2 ? 'hg' : 'w'}`">
        1{{ index + 1 }}
      </div>
      <div :class="`c2 hr`">
        {{ getUnit(index)?.tacan }}
      </div>
      <Input class="c3 tb hr" />
      <input class="c3 tb hr" />
      <input class="c3 tb hr" />
      <input class="c3 tb hr" />
      <input class="c4 tb hr" />
    </div>

    <div class="c6 g">CODEWORD</div>
    <div class="c12 g">MEANING</div>
    <div class="c8 g">CLASS</div>
    <div class="c2 g">MTR</div>
    <div class="c2 g">FR</div>
    <div class="c2 g">DOR</div>
    <div class="c2 g">DR</div>
    <div class="c2 g">MAR</div>

    <div class="c36 parent" v-for="index in new Array(8).keys()">
      <input :class="`c6 tb ${index % 2 ? 'hg' : 'w'}`" />
      <input :class="`c12 tb ${index % 2 ? 'hg' : 'w'}`" />
      <div class="c8 hr">{{threatRanges[index]?.class}}</div>
      <input class="c2 tb hr" />
      <input class="c2 tb hr" />
      <div class="c2 hr">{{threatRanges[index]?.dor.toFixed(1)}}</div>
      <div class="c2 hr">{{threatRanges[index]?.dr.toFixed(1)}}</div>
      <div class="c2 hr">{{threatRanges[index]?.mar.toFixed(1)}}</div>
    </div>

    <div class="c5 g">C/S</div>
    <div class="c3 g">TASK</div>
    <div class="c1 g">#</div>
    <div class="c3 g">TYPE</div>
    <div class="c3 g">WPN</div>
    <div class="c3 g">STN</div>
    <div class="c2 g">M1</div>
    <div class="c3 g">CAP</div>
    <div class="c3 g">PRI</div>
    <div class="c3 g">SANC</div>
    <div class="c3 g">M3</div>
    <div class="c2 g">IDM</div>
    <div class="c2 g">FC</div>

    <div class="c36 parent" v-for="index in new Array(5).keys()">
      <div :class="`c5 ${index % 2 ? 'hg' : 'w'}`">
        {{ selectedPKG.flights[index]?.callsign }}
        {{ selectedPKG.flights[index]?.callsignNumber }}
      </div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'}`">
        {{ selectedPKG.flights[index]?.missionType }}
      </div>
      <div :class="`c1 ${index % 2 ? 'hg' : 'w'}`">
        {{ selectedPKG.flights[index]?.units.length }}
      </div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'}`">
        {{ selectedPKG.flights[index]?.aircrafttype }}
      </div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'}`"></div>
      <div :class="`c3 hr`">
        {{
          selectedPKG.flights[index]?.units[0].STN.padStart(5, "0")
            .substring(0, 4)
            .concat("X")
        }}
      </div>
      <input class="c2 tb hr" />
      <input class="c3 tb hr" />
      <input class="c3 tb hr" />
      <input class="c3 tb hr" />
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'}`">        
        {{
          selectedPKG.flights[index]?.units[0].STN.padStart(5, "0")
            .substring(1, 4)
            .concat("X")
        }}</div>
      <div :class="`c2 ${index % 2 ? 'hg' : 'w'}`">
        {{ index + 1 }}0
      </div>
      <div :class="`c2 ${index % 2 ? 'hg' : 'w'}`">001</div>
    </div>

    <div class="c3 g">JKR</div>
    <div class="c3 g">FUEL</div>
    <div class="c3 g">WPN</div>
    <div class="c11 g">ACTION</div>
    <div class="c7 g">TAKE IF SHUFFLE</div>
    <div class="c3 g">STUD</div>
    <div class="c3 g">FRQ</div>
    <div class="c3 g">CMRK</div>
    <div class="c36 parent" v-for="index in new Array(4).keys()">
      <div class="c3 g"> {{ (index + 1) % 4 ? "J" + (index + 1) : "BGO" }} </div>
      <input :class="`c3 tb ${(index + 1) % 4 ? 'hr' : 'hg'}`" />
      <input :class="`c3 tb ${index % 2 ? 'hg' : 'w'}`" />
      <input :class="`c11 tb ${index % 2 ? 'hg' : 'w'}`" />
      <div class="c2 g"> {{ (index + 1) % 4 ? ((index + 1) % 3 ? ((index + 1) % 2 ? "CX" : "PRI") : "SEC") : "TER" }} </div>
      <input :class="`c5 ${(index + 1) > 2 ? 'hr' : (index + 1) % 2 ? 'w' : 'hg'}`" />
      <div :class="`c3 g`">{{ "2" + (index) }}</div>
      <input :class="`c3 ${(index + 1) > 2 ? 'hr' : (index + 1) % 2 ? 'w' : 'hg'}`" />
      <input :class="`c3 hr`" />
    </div>
    <div class="c36 r">RED BOXED CELLS SECRET WHEN COMPLETE - SHRED AFTER USE</div>
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