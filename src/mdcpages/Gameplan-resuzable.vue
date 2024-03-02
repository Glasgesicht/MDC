<!--

<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref } from "vue";
import Textarea from "primevue/inputtext";
import { storeToRefs } from "pinia";
import { usePackageStore } from "../stores/packageStore";
import Dropdown from "primevue/dropdown";

import { flights } from "../config/constants";

/// OK, please someone take a look at this.
/// Fuck CSS, this shit just doesn't work and it's beyond my patience right now.

const { pkgnr, situation, roe } = storeToRefs(usePackageStore());

const pagenr = 1; // TODO: Compute based on selected pages for export

const showROE = inject("showROE");

const resizing = ref(false);
const startY = ref(0);
const box1Height = ref(200); // Initial height for Box 1
const box2Height = ref(200); // Initial height for Box 2

const startResize = (e: any) => {
  resizing.value = true;
  startY.value = e.clientY;

  // Add event listeners to the document level
  document.addEventListener("mouseup", stopResize);
  document.addEventListener("mousemove", resize);
};

const stopResize = () => {
  resizing.value = false;

  // Remove event listeners from the document level
  document.removeEventListener("mouseup", stopResize);
  document.removeEventListener("mousemove", resize);
};

const resize = (e: any) => {
  if (resizing.value) {
    const deltaY = e.clientY - startY.value;
    box1Height.value += deltaY;
    box2Height.value -= deltaY;
    startY.value = e.clientY;
  }
};
</script>

<template>
  <div class="mcdpage">
    <div class="border pagenr">PAGE {{ pagenr }}</div>
    <div class="border header">BRIEFING CARD</div>
    <div class="border mcd-s-6 mcd-wog">MISSION</div>
    <div class="border mcd-s-6 mcd-bow">{{ missionNr }}</div>
    <div class="border mcd-s-5 mcd-wog">CALLSIGN</div>
    <select v-model="callsign" class="dropdown mcd-s-5 mcd-bow">
      <option v-for="flight of flights">{{ flight.Callsign }}</option>
    </select>
    <div class="border mcd-s-5 mcd-wog">PACKAGE</div>
    <div class="border mcd-s-5 mcd-bow">{{ pkgnr }}</div>
    <div class="border mcd-s-6 mcd-wog">HOMEPLATE</div>
    <div class="border mcd-s-6 mcd-bog">{{ homePlate }}</div>
    <div class="border mcd-rnlaf313">RNLAF 313 SQUADRON</div>
    <div class="border mcd-s-6 mcd-wog">MSN TYPE</div>
    <div class="border mcd-s-6 mcd-bow">{{ msnType }}</div>
    <div class="border mcd-s-6 mcd-wog">PACKAGE TASK</div>
    <input v-model="pkgTask" class="border mcd-s-26 mcd-bog textbox" />
    <div class="border mcd-s-6 mcd-wog">FLIGHT TASK</div>
    <input v-model="flightTask" class="border mcd-s-26 mcd-bow" />
    <div class="border mcd-s-col mcd-wog">SITUATION</div>
    <textarea
      v-model="situation"
      class="border mcd-row-5 mcd-s-col mcd-bow textbox"
    />

    <div class="border mcd-s-16 mcd-wog">SURFACE THREATS</div>
    <div class="border mcd-s-16 mcd-wog">AIR THREATS</div>
    <div class="border mcd-row-2 mcd-s-16 mcd-bow">{{ surfaceT }}</div>
    <textarea v-model="airT" class="mcd-row-2 mcd-s-16 mcd-bow textbox" />
    <div class="border mcd-s-col mcd-wog">GAMEPLAN</div>

    <div class="grid-container mcd-s-col mcd-row-16">
      <textarea
        type="text"
        class="box box1 mcd-s-col mcd-row-8"
        v-model="gameplan"
        :style="{ height: box1Height + 'px' }"
      />
      <div
        class="resizer mcd-s-col"
        id="dragbar"
        style="height: 10px; margin-bottom: 0"
        @mousedown="startResize"
        @mouseup="stopResize"
        @mousemove="resize"
      ></div>
      <div class="box box2 mcd-row-7 mcd-s-col">
        <div
          v-if="showROE"
          class="border roehead mcd-s-col"
          style="width: 100%"
        >
          RULES OF ENGAGEMENT
        </div>
        <textarea
          v-if="showROE"
          type="text"
          v-model="roe"
          :style="{ height: box2Height + 'px', width: 100 + '%' }"
          class="border mcd-s-col roe textbox non-resizable mcd-row-8"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  display: inline-grid;
  grid-template-areas:
    "box1"
    "resizer"
    "box2";
}
.box {
  grid-area: box1;
  border: 1px solid #ccc;
  overflow: hidden;
}

.resizer {
  grid-area: resizer;
  cursor: ns-resize;
  height: 10px;
  background-color: #ddd;
}
</style>
-->
