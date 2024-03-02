<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref } from "vue";
import Textarea from "primevue/inputtext";
import { storeToRefs } from "pinia";
import { usePackageStore } from "../stores/packageStore";
import Dropdown from "primevue/dropdown";

import { flights } from "../config/constants";

const { pkgnr, situation, roe } = storeToRefs(usePackageStore());

const pagenr = 1; // TODO: Compute based on selected pages for export

// TODO: Figure out why vertical text is 2 columns wide... Preferably stop it from happening.
// Eventually add colour coding to pre-push/post-exit.
</script>

<template>
  <div class="mcdpage">
    <div class="border pagenr">PAGE {{ pagenr }}</div>
    <div class="border header">PACKAGE COORDINATION</div>

    <div class="border mcd-row-4 mcd-s-1 mcd-wog text-rotate-left">PACKAGE</div>

    <div class="border mcd-s-6 mcd-wog">CALLSIGN</div>
    <div class="mcd-s-5" v-for="index in [...Array(5).keys()]">
      <div class="border mcd-s-2 mcd-bow">{{ index + 1 }}</div>
    </div>
    <div class="border mcd-s-6 mcd-wog"># A/C</div>
    <div class="mcd-s-5" v-for="index in [...Array(5).keys()]">
      <div class="border mcd-s-2 mcd-bog">{{ index + 1 }}</div>
    </div>
    <div class="border mcd-s-6 mcd-wog">TASKING</div>
    <div class="mcd-s-5" v-for="index in [...Array(5).keys()]">
      <div class="border mcd-s-2 mcd-bow">{{ index + 1 }}</div>
    </div>
    <div class="border mcd-s-31 mcd-wog">TIMINGS</div>

    <div class="border mcd-row-9 mcd-s-1 mcd-wog text-rotate-left">
      PRE-PUSH
    </div>

    <div class="border mcd-s-6 mcd-row-2 mcd-wog">DEPARTURE</div>
    <div class="mcd-s-5 mcd-row-2" v-for="index in [...Array(5).keys()]">
      <div class="border mcd-s-5 mcd-row-2 mcd-bow">{{ index + 1 }}</div>
    </div>
    <div class="border mcd-s-6 mcd-wog">T/O TIME</div>
    <div class="mcd-s-5" v-for="index in [...Array(5).keys()]">
      <div class="border mcd-s-2 mcd-bog">{{ index + 1 }}</div>
    </div>
    <div class="border mcd-s-6 mcd-wog">AAR TRACK</div>
    <div class="mcd-s-5" v-for="index in [...Array(5).keys()]">
      <div class="border mcd-s-2 mcd-bow">{{ index + 1 }}</div>
    </div>
    <div class="border mcd-s-6 mcd-row-2 mcd-wog">AAR TOS</div>
    <div class="mcd-s-5 mcd-row-2" v-for="index in [...Array(5).keys()]">
      <div class="border mcd-s-5 mcd-row-2 mcd-bog">{{ index + 1 }}</div>
    </div>
    <div class="border mcd-s-6 mcd-wog">HOLD TRACK</div>
    <div class="mcd-s-5" v-for="index in [...Array(5).keys()]">
      <div class="border mcd-s-2 mcd-bow">{{ index + 1 }}</div>
    </div>
    <div class="border mcd-s-6 mcd-row-2 mcd-wog">HOLD TOS</div>
    <div class="mcd-s-5 mcd-row-2" v-for="index in [...Array(5).keys()]">
      <div class="border mcd-s-5 mcd-row-2 mcd-bog">{{ index + 1 }}</div>
    </div>

    <div class="border mcd-row-10 mcd-s-1 mcd-wog text-rotate-left">TARGET</div>

    <div class="border mcd-s-6 mcd-row-2 mcd-wog">PUSH POINT</div>
    <div class="mcd-s-5 mcd-row-2" v-for="index in [...Array(5).keys()]">
      <div class="border mcd-s-5 mcd-row-2 mcd-bow">{{ index + 1 }}</div>
    </div>
    <div class="border mcd-s-6 mcd-wog">PUSH TOS</div>
    <div class="mcd-s-5" v-for="index in [...Array(5).keys()]">
      <div class="border mcd-s-2 mcd-bog">{{ index + 1 }}</div>
    </div>
    <div class="border mcd-s-6 mcd-row-2 mcd-wog">TARGET</div>
    <div class="mcd-s-5 mcd-row-2" v-for="index in [...Array(5).keys()]">
      <div class="border mcd-s-5 mcd-row-2 mcd-bog">{{ index + 1 }}</div>
    </div>
    <div class="border mcd-s-6 mcd-row-2 mcd-wog">TOT/TOS</div>
    <div class="mcd-s-5 mcd-row-2" v-for="index in [...Array(5).keys()]">
      <div class="border mcd-s-5 mcd-row-2 mcd-bow">{{ index + 1 }}</div>
    </div>
    <div class="border mcd-s-6 mcd-row-2 mcd-wog">EXIT POINT</div>
    <div class="mcd-s-5 mcd-row-2" v-for="index in [...Array(5).keys()]">
      <div class="border mcd-s-5 mcd-row-2 mcd-bog">{{ index + 1 }}</div>
    </div>
    <div class="border mcd-s-6 mcd-wog">EXIT TOS</div>
    <div class="mcd-s-5" v-for="index in [...Array(5).keys()]">
      <div class="border mcd-s-2 mcd-bog">{{ index + 1 }}</div>
    </div>

    <div class="border mcd-row-8 mcd-s-1 mcd-wog text-rotate-left">
      POST EXIT
    </div>

    <div class="border mcd-s-6 mcd-wog">AAR TRACK</div>
    <div class="mcd-s-5" v-for="index in [...Array(5).keys()]">
      <div class="border mcd-s-2 mcd-bog">{{ index + 1 }}</div>
    </div>
    <div class="border mcd-s-6 mcd-row-2 mcd-wog">AAR TOS</div>
    <div class="mcd-s-5 mcd-row-2" v-for="index in [...Array(5).keys()]">
      <div class="border mcd-s-5 mcd-row-2 mcd-bog">{{ index + 1 }}</div>
    </div>
    <div class="border mcd-s-6 mcd-row-2 mcd-wog">ARRIVAL</div>
    <div class="mcd-s-5 mcd-row-2" v-for="index in [...Array(5).keys()]">
      <div class="border mcd-s-5 mcd-row-2 mcd-bow">{{ index + 1 }}</div>
    </div>
    <div class="border mcd-s-6 mcd-wog">LAND TOS</div>
    <div class="mcd-s-5" v-for="index in [...Array(5).keys()]">
      <div class="border mcd-s-2 mcd-bog">{{ index + 1 }}</div>
    </div>
    <div class="border mcd-s-6 mcd-row-2 mcd-wog">ALTERNATE</div>
    <div class="mcd-s-5 mcd-row-2" v-for="index in [...Array(5).keys()]">
      <div class="border mcd-s-5 mcd-row-2 mcd-bog">{{ index + 1 }}</div>
    </div>
  </div>
</template>
<style scoped>
.parent {
  display: inline-grid;
  grid-template-columns: repeat(31, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}
</style>
../stores/packageStore
