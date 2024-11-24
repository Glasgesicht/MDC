<script setup lang="ts">
import Agencies from "./child components/agencies.vue";
import { inject } from "vue";
import { storeToRefs } from "pinia";

import { useFlightStore } from "@/controller/stores/flightStore";

const { getFlight } = storeToRefs(useFlightStore());

const { pagenr } = defineProps({
  pagenr: {
    required: true,
    type: Number,
  },
});
</script>

<template>
  <div class="mdcpage bdr ctr" name="mdcpage">
    <div class="c36 r bdr ctr">
      RED BOXED CELLS SECRET WHEN COMPLETE - SHRED AFTER USE
    </div>
    <div class="c3 y bdr ctr">PAGE {{ pagenr }}</div>
    <div class="c33 g bdr ctr">COMMUNICATIONS</div>

    <div class="c2 g bdr ctr"></div>
    <div class="c3 g bdr ctr">FREQ</div>
    <div class="c5 g bdr ctr">COLOUR</div>
    <div class="c1 g bdr ctr">F</div>
    <div class="c1 g bdr ctr">H</div>
    <div class="c6 g bdr ctr">DESCRIPTION</div>

    <div class="c2 g bdr ctr">VHF</div>
    <div class="c3 g bdr ctr">FREQ</div>
    <div class="c5 g bdr ctr">COLOUR</div>
    <div class="c1 g bdr ctr">F</div>
    <div class="c1 g bdr ctr">H</div>
    <div class="c6 g bdr ctr">DESCRIPTION</div>

    <div class="c36 child" v-for="index in new Array(20).keys()">
      <div class="c2 g bdr ctr">{{ index + 1 }}</div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'} bdr ctr`">
        {{ getFlight.comms.radio1[index]?.freq }}
      </div>
      <div :class="`c5 ${index % 2 ? 'hg' : 'w'} bdr ctr`">
        {{ getFlight.comms.radio1[index]?.name }}
        {{ getFlight.comms.radio1[index]?.number || "" }}
      </div>
      <div :class="`c1 hr bdr ctr`"></div>
      <div :class="`c1 hr bdr ctr`"></div>
      <div :class="`c6 ${index % 2 ? 'hg' : 'w'} bdr ctr`">
        {{ getFlight.comms.radio1[index]?.description }}
      </div>

      <div class="c2 g bdr ctr">{{ index + 1 }}</div>
      <div :class="`c3 ${index % 2 ? 'hg' : 'w'} bdr ctr`">
        {{ getFlight.comms.radio2[index]?.freq }}
      </div>
      <div :class="`c5 ${index % 2 ? 'hg' : 'w'} bdr ctr`">
        {{ getFlight.comms.radio2[index]?.name }}
        {{ getFlight.comms.radio2[index]?.number || "" }}
      </div>
      <div :class="`c1 hr bdr ctr`"></div>
      <div :class="`c1 hr bdr ctr`"></div>
      <div :class="`c6 ${index % 2 ? 'hg' : 'w'} bdr ctr`">
        {{ getFlight.comms.radio2[index]?.description }}
      </div>
    </div>
    <Agencies />

    <div class="c36 r bdr ctr">
      RED BOXED CELLS SECRET WHEN COMPLETE - SHRED AFTER USE
    </div>
  </div>
</template>
<style scoped>
@import "@/assets/styles/mdc.css";

.font500 {
  font-weight: 500;
}
</style>
