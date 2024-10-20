<script setup lang="ts">
import { inject } from "vue";
import { storeToRefs } from "pinia";

import { useFlightStore } from "@/stores/flightStore";

const { getFlight } = storeToRefs(useFlightStore());

const { pagenr } = defineProps({
  pagenr: {
    required: true,
    type: Number,
  },
});
</script>

<template>
  <div class="mdcpage bdr" name="mdcpage">
    <div class="c36 r bdr">
      RED BOXED CELLS SECRET WHEN COMPLETE - SHRED AFTER USE
    </div>
    <div class="c3 y bdr">PAGE {{ pagenr }}</div>
    <div class="c33 g bdr">COMMUNICATIONS</div>

    <div class="c2 g bdr"></div>
    <div class="c3 g bdr">FREQ</div>
    <div class="c5 g bdr">COLOUR</div>
    <div class="c1 g bdr">F</div>
    <div class="c1 g bdr">H</div>
    <div class="c6 g bdr">DESCRIPTION</div>

    <div class="c2 g bdr">VHF</div>
    <div class="c3 g bdr">FREQ</div>
    <div class="c5 g bdr">COLOUR</div>
    <div class="c1 g bdr">F</div>
    <div class="c1 g bdr">H</div>
    <div class="c6 g bdr">DESCRIPTION</div>

    <div class="c36 parent" v-for="index in new Array(20).keys()">
      <div class="c2 g bdr">{{ index + 1 }}</div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'} bdr`">
        {{ getFlight.comms.radio1[index]?.freq }}
      </div>
      <div :class="`c5 ${index % 2 ? 'hg' : 'w'} bdr`">
        {{ getFlight.comms.radio1[index]?.name }}
        {{ getFlight.comms.radio1[index]?.number || "" }}
      </div>
      <div :class="`c1 hr bdr`"></div>
      <div :class="`c1 hr bdr`"></div>
      <div :class="`c6 ${index % 2 ? 'hg' : 'w'} bdr`">
        {{ getFlight.comms.radio1[index]?.description }}
      </div>

      <div class="c2 g bdr">{{ index + 1 }}</div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'} bdr`">
        {{ getFlight.comms.radio2[index]?.freq }}
      </div>
      <div :class="`c5 ${index % 2 ? 'hg' : 'w'} bdr`">
        {{ getFlight.comms.radio2[index]?.name }}
        {{ getFlight.comms.radio2[index]?.number || "" }}
      </div>
      <div :class="`c1 hr bdr`"></div>
      <div :class="`c1 hr bdr`"></div>
      <div :class="`c6 ${index % 2 ? 'hg' : 'w'} bdr`">
        {{ getFlight.comms.radio2[index]?.description }}
      </div>
    </div>

    <div class="c36 r bdr">
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
